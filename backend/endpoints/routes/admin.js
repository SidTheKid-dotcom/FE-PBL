const express = require('express');
const adminRouter = express.Router();

const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 1024 * 1024 * 5 } }); //Limits the image uploaded upto 5Mb

const authMiddleware = require('./authMiddleware.js');
const loginMiddleware = require('./loginMiddleware.js')

const JWT_SECRET = require("../../config.js");
const cloudinary = require("./cloudinaryConfig.js")

const { createAdmin } = require('../../zod/types.js');
const { ADMIN, MENU, ORDERS } = require('../../database/db.js');

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
        const token = jwt.sign(payload, JWT_SECRET, options);

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

adminRouter.post('/signin', loginMiddleware, async function (req, res) {
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
        const token = jwt.sign(payload, JWT_SECRET, options);

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

adminRouter.get('/home', authMiddleware, async function (req, res) {
    const menu = await MENU.find();

    return res.status(200).json({
        menu: menu
    })
});

adminRouter.post('/addMenuItem', authMiddleware, upload.single('image'), async function (req, res) {
    const { title, wrappedIngredients, price } = req.body;
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
    catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ message: "Upload failed" });
    }
});

adminRouter.put('/updateMenuItem', authMiddleware, async function (req, res) {

    const { itemID, title, ingredients, price } = req.body;

    const existingItem = await MENU.findOne({ title: title });

    if (existingItem && existingItem._id.toString() !== itemID) {
        return res.status(403).json({
            message: "Item with the title already exists"
        })
    }

    try {

        await MENU.findOneAndUpdate(
            { _id: itemID },
            { $set: { title: title, ingredients: ingredients, price: price } }
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

adminRouter.delete('/deleteMenuItem', authMiddleware, async function (req, res) {

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

adminRouter.get('/allOrders', authMiddleware, async function (req, res) {
    try {
        const orders = await ORDERS.find()
            .select('-_id -items._id')
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

adminRouter.get('/pendingOrders', authMiddleware, async function (req, res) {
    try {
        const orders = await ORDERS.find()
            .select('-_id -items._id')
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

module.exports = adminRouter;