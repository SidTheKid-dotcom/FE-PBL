const express = require('express');
const adminRouter = express.Router();

const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 1024 * 1024 * 5 } }); //Limits the image uploaded upto 5Mb

const { authMiddlewareAdmin } = require('./authMiddleware.js');
const { loginMiddlewareAdmin } = require('./loginMiddleware.js');

const { JWT_SECRET_ADMIN } = require("../../config.js");
const cloudinary = require("./cloudinaryConfig.js");

const { createAdmin } = require('../../zod/types.js');
const { ADMIN, MENU, ORDERS, CATEGORIES } = require('../../database/db.js');

adminRouter.post('/signup', async function (req, res) {
    const { firstName, lastName, mobile, email, password } = req.body;

    const success = createAdmin.safeParse({
        firstName,
        lastName,
        mobile,
        email,
        password
    });

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingAdmin = await ADMIN.findOne({
        "data.email": email
    })

    if (existingAdmin) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }


    const admin = await ADMIN.create({
        data: {
            firstname: firstName,
            lastname: lastName,
            mobile: mobile,
            email: email,
            password: password
        }
    })

    if (!admin) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }

    const adminID = admin._id;
    const payload = { adminID: adminID };
    const options = { expiresIn: '6h' };


    try {
        const token = jwt.sign(payload, JWT_SECRET_ADMIN, options);

        return res.status(200).json({
            message: "New Admin created",
            token: token
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Error in creating JWT"
        })
    }

});

adminRouter.post('/signin', loginMiddlewareAdmin, async function (req, res) {
    if (req.adminID) {
        return res.status(200).json({ msg: 'Admin logged in using JWT' });
    }

    const { mobile, password } = req.body;

    const admin = await ADMIN.findOne({
        $and: [
            { "data.mobile": mobile },
            { "data.password": password }
        ]
    })

    if (!admin) {
        return res.status(403).json({
            message: "admin not found"
        })
    }

    const adminID = admin._id;
    const payload = { adminID: adminID };
    const options = { expiresIn: '6h' };


    try {
        const token = jwt.sign(payload, JWT_SECRET_ADMIN, options);

        return res.status(200).json({
            message: "admin signed in",
            token: token
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Error in creating JWT"
        })
    }
});

adminRouter.get('/home', authMiddlewareAdmin, async function (req, res) {
    const menu = await MENU.find().populate('category');

    return res.status(200).json({
        menu: menu
    })
});

adminRouter.post('/addMenuItem', authMiddlewareAdmin, upload.single('image'), async function (req, res) {
    const { title, categoryID, wrappedIngredients, price } = req.body;
    const image = req.file;

    const ingredients = JSON.parse(wrappedIngredients);

    if (!image) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const imageData = image.buffer;

        // Upload the image using Cloudinary's upload_stream method:
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
            stream.write(imageData);
            stream.end();
        });

        const imageUrl = result.secure_url;

        const existingItem = await MENU.findOne({ title: title })

        if (existingItem) {
            return res.status(411).json({
                message: "Item already exists in the menu"
            })
        }

        try {
            await MENU.create({
                category: categoryID,
                title: title,
                ingredients: ingredients,
                price: price,
                imageUrl: imageUrl
            })

            return res.status(200).json({
                message: "Item successfully added to menu"
            })
        }
        catch (e) {
            return res.status(403).json({
                message: "Could not add item to menu"
            })
        }
    }
    catch (e) {
        console.error("Error uploading image:", e);
        return res.status(500).json({ message: "Upload failed" });
    }
});

adminRouter.put('/updateMenuItem', authMiddlewareAdmin, upload.single('image'), async function (req, res) {

    const { itemID, title, category, wrappedIngredients, price, imageURL } = req.body;
    const image = req.file;

    // imageUrl is what we put into DB, 
    // imageURL is what we get from frontend
    let imageUrl = null;

    const ingredients = JSON.parse(wrappedIngredients);

    const existingItem = await MENU.findOne({ title: title });

    if (existingItem && existingItem._id.toString() !== itemID) {
        return res.status(403).json({
            message: "Item with the title already exists"
        })
    }

    try {
        if (image) {
            const imageData = image.buffer;

            // Upload the image using Cloudinary's upload_stream method:
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
                stream.write(imageData);
                stream.end();
            });
            imageUrl = result.secure_url;
        }
        else {
            imageUrl = imageURL;
        }
        console.log(category);
        await MENU.findOneAndUpdate(
            { _id: itemID },
            { $set: { title: title, category: category, ingredients: ingredients, price: price, imageUrl: imageUrl } }
        )

        return res.status(200).json({
            message: "Item updated successfully"
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Could not update item"
        })
    }

});

adminRouter.delete('/deleteMenuItem', authMiddlewareAdmin, async function (req, res) {

    const { itemID } = req.body;

    if (!itemID) {
        return res.status(403).json({
            message: "Please send valid item ID"
        })
    }

    try {

        await MENU.findOneAndDelete({ _id: itemID });

        return res.status(200).json({
            message: "Item deleted successfully"
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Could not delete item"
        })
    }
});

adminRouter.post('/addCategory', authMiddlewareAdmin, async function (req, res) {
    const category = req.body.category;

    const existingCategory = await CATEGORIES.findOne({ name: category })

    if (existingCategory) {
        return res.status(411).json({
            message: "Category already exists in the menu"
        })
    }

    try {
        await CATEGORIES.create({
            name: category
        })
        return res.status(200).json({
            message: "Category successfully added",
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Server error occured while adding category"
        })
    }

})

adminRouter.get('/getCategories', authMiddlewareAdmin, async function (req, res) {
    const categories = await CATEGORIES.find();

    return res.status(200).json({
        categories: categories
    })
})

adminRouter.get('/allOrders', authMiddlewareAdmin, async function (req, res) {
    try {
        const orders = await ORDERS.find()
            .select()
            .populate('items.menuItem', '-_id title ingredients price', MENU);

        return res.status(200).json({
            orders: orders
        })
    }
    catch (e) {
        return res.status(403).json({
            message: "Error in fetching all orders"
        })
    }
});

adminRouter.get('/pendingOrders', authMiddlewareAdmin, async function (req, res) {
    try {
        const orders = await ORDERS.find()
            .select('-items._id')
            .populate('items.menuItem', '-_id title ingredients price', MENU);

        const pendingOrders = orders.filter(order => order.status === "Pending")

        return res.status(200).json({
            orders: pendingOrders
        })
    }
    catch (e) {
        return res.status(403).json({
            message: "Error in fetching all orders"
        })
    }
});


adminRouter.put('/updateOrderStatus', authMiddlewareAdmin, async (req, res) => {

    const { orderID } = req.body;

    if (!orderID) {
        return res.status(403).json({
            message: "Please send valid order ID"
        })
    }

    try {

        const updatedOrder = await ORDERS.findByIdAndUpdate(
            { _id: orderID },
            { $set: { status: "Complete" } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            updatedOrder: updatedOrder
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Could not update order status"
        })
    }
});

adminRouter.delete('/deleteOrder', authMiddlewareAdmin, async (req, res) => {
    const { orderID } = req.body;

    console.log(orderID);

    if (!orderID) {
        return res.status(403).json({
            message: "Please send valid order ID"
        })
    }

    try {

        const deletedOrder = await ORDERS.findByIdAndDelete(orderID);

        if (!deletedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order deleted successfully",
            deletedOrder: deletedOrder
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Could not update order status"
        })
    }
})

adminRouter.get('/viewCategories', authMiddlewareAdmin, async (req, res) => {
    try {
        const categories = await CATEGORIES.find();

        return res.status(200).json({
            categories: categories
        })
    }
    catch (e) {
        return res.status(403).json({
            message: "Error in fetching all categories"
        })
    }
})

module.exports = adminRouter;