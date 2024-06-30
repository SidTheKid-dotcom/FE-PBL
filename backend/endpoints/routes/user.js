const express = require('express');
const userRouter = express.Router();

const jwt = require('jsonwebtoken');
const { authMiddlewareUser } = require('./authMiddleware.js');
const { loginMiddlewareUser } = require('./loginMiddleware.js');

const { createUser } = require('../../zod/types.js');
const { USER, MENU, ORDERS, CATEGORIES, FEEDBACK } = require('../../database/db.js');

const { JWT_SECRET_USER } = require("../../config.js");

const Razorpay = require('razorpay');

const RAZORPAY_KEY_ID = 'rzp_test_YuGrLzykusvpEM'
const RAZORPAY_SECRET_KEY = 'IVHjg4dlohmNMr6IE4RqxlxY'

const instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET_KEY,
});

userRouter.post('/signup', async function (req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(411).json({
            message: "Missing inputs"
        })
    }

    const success = createUser.safeParse({
        name,
        email,
        password
    });

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await USER.findOne({
        "data.email": email
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }


    const user = await USER.create({
        data: {
            name: name,
            email: email,
            password: password
        },
        myOrders: []
    })

    if (!user) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }

    const userID = user._id;
    const payload = { userID: userID, role: 'user' };
    const options = { expiresIn: '8h' };


    try {
        const token = jwt.sign(payload, JWT_SECRET_USER, options);

        return res.status(200).json({
            message: "New user created",
            token: token
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Error in creating JWT"
        })
    }

});

userRouter.post('/signin', loginMiddlewareUser, async function (req, res) {
    if (req.userID) {
        return res.status(200).json({ msg: 'User logged in using JWT' });
    }

    const { email, password } = req.body;

    const user = await USER.findOne({
        $and: [
            { "data.email": email },
            { "data.password": password }
        ]
    })

    if (!user) {
        return res.status(403).json({
            message: "User not found"
        })
    }

    const userID = user._id;
    const payload = { userID: userID, role: 'user' };
    const options = { expiresIn: '8h' };

    try {
        const token = jwt.sign(payload, JWT_SECRET_USER, options);

        return res.status(200).json({
            message: "User sucessfully signed in",
            token: token
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Error in creating JWT"
        })
    }
});

// Main user landing page endpoints
userRouter.get('/home', authMiddlewareUser, async function (req, res) {
    // 1. Main Menu db call

    const filter = req.query.filter;

    let query = {};
    if (filter) {
        query = { category: filter };
    }

    const menuItems = await MENU.find(query).sort({ title: 1 });
    const categories = await CATEGORIES.find();

    res.json({
        menu: menuItems,
        categories: categories
    })
});


//My-orders page for user
userRouter.get('/my-orders', authMiddlewareUser, async function (req, res) {
    try {
        // Get the user's ID from the request
        const userID = req.userID;

        // Find the user by ID
        const user = await USER.findById(userID);

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get the orderIDs from the user
        const orderIDs = user.myOrders;

        if (!orderIDs || orderIDs.length === 0) {
            return res.status(200).json({ message: "No orders found", orders: [] });
        }

        const orderPromises = orderIDs.map(orderID => ORDERS.findById(orderID)
            .populate('items.menuItem', '-_id title ingredients price', MENU));
        const orders = await Promise.all(orderPromises);

        if (!orders || orders.length === 0) {
            return res.status(200).json({ message: "No orders found", orders: [] });
        }

        return res.status(200).json({
            message: "Successfully fetched orders",
            orders: orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Pay page for user

userRouter.post('/confirmPayment', authMiddlewareUser, async function (req, res) {

    const order = req.body.order;

    const newOrder = await ORDERS.create(order)
    const orderID = newOrder._id;

    const updatedUser = await USER.findOneAndUpdate(
        { _id: req.userID },
        { $push: { myOrders: orderID.toString() } },
        { new: true }
    )

    if (!updatedUser) {
        return res.status(411).json({
            message: "User not found"
        })
    }

    return res.status(200).json({
        message: 'Order added'
    })
})

userRouter.post('/feedback', authMiddlewareUser, async function (req, res) {
    try {
        const userID = req.userID;
        const { rating, feedback, type } = req.body; // Extract rating and feedback from request body

        // Check if user exists
        const user = await USER.findById(userID);
        if (!user) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Check if user has already given feedback
        const existingFeedback = await FEEDBACK.findOne({ userID: userID });
        if (existingFeedback) {
            return res.status(400).json({ message: "User has already given feedback" });
        }

        // Create feedback
        const createdFeedback = await FEEDBACK.create({
            rating: rating,
            feedback: feedback,
            type: type,
            userID: userID
        });

        res.status(201).json({
            message: "New Feedback Created",
            feedback: createdFeedback
        });
    } catch (error) {
        console.error("Error in giving feedback:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

userRouter.put('/feedback', authMiddlewareUser, async function (req, res) {
    try {
        const userID = req.userID;
        const { rating, feedback, type } = req.body; // Extract rating and feedback from request body

        // Check if user exists
        const user = await USER.findById(userID);
        if (!user) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Check if user has already given feedback
        const existingFeedback = await FEEDBACK.findOne({ userID: userID });
        if (!existingFeedback) {
            return res.status(400).json({ message: "User has never posted feedback before" });
        }

        // Create feedback
        await FEEDBACK.findOneAndUpdate(
            { userID: userID, },
            {
                rating: rating,
                feedback: feedback,
                type: type
            },
            {
                useFindAndModify: false // To use the native findOneAndUpdate rather than findAndModify (deprecated in Mongoose 6)
            });

        res.status(201).json({
            message: "Feedback Updated",
        });
    } catch (error) {
        console.error("Error in updating feedback:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

userRouter.get('/feedback', authMiddlewareUser, async function (req, res) {

    const userID = req.userID;

    try {
        // Fetch feedbacks with non-empty feedback strings, sort by rating in decreasing order, and limit to top 5
        const feedback = await FEEDBACK.find({ userID: userID });

        if (!feedback || feedback.length === 0) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({
            message: "FeedBack of user retrieved successfully",
            feedback: feedback
        });
    } catch (error) {
        console.error("Error in retrieving feedback of user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = userRouter;