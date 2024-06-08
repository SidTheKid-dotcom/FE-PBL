const express = require('express');
const userRouter = express.Router();

const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware.js');
const loginMiddleware = require('./loginMiddleware.js')
const { createUser } = require('../../zod/types.js');
const { USER, MENU, ORDERS, CATEGORIES } = require('../../database/db.js');

const JWT_SECRET = require("../../config.js");

const mongoose = require('mongoose');

const Razorpay = require('razorpay');

const RAZORPAY_KEY_ID = 'rzp_test_YuGrLzykusvpEM'
const RAZORPAY_SECRET_KEY = 'IVHjg4dlohmNMr6IE4RqxlxY'

const instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET_KEY,
});

userRouter.post('/signup', async function (req, res) {
    const { firstName, lastName, mobile, email, password } = req.body;

    const success = createUser.safeParse({
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
            firstname: firstName,
            lastname: lastName,
            mobile: mobile,
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
    const payload = { userID: userID };
    const options = { expiresIn: '8h' };


    try {
        const token = jwt.sign(payload, JWT_SECRET, options);

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

userRouter.post('/signin', loginMiddleware, async function (req, res) {
    if (req.userID) {
        return res.status(200).json({ msg: 'User logged in using JWT' });
    }

    const { mobile, password } = req.body;

    const user = await USER.findOne({
        $and: [
            { "data.mobile": mobile },
            { "data.password": password }
        ]
    })

    if (!user) {
        return res.status(403).json({
            message: "User not found"
        })
    }

    const userID = user._id;
    const payload = { userID: userID };
    const options = { expiresIn: '8h' };

    try {
        const token = jwt.sign(payload, JWT_SECRET, options);

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
userRouter.get('/home', authMiddleware, async function (req, res) {
    // 1. Main Menu db call

    const filter = req.query.filter;

    let query = {};
    if (filter) {
        query = { category: filter };
    }

    const menuItems = await MENU.find(query);
    const categories = await CATEGORIES.find();

    res.json({
        menu: menuItems,
        categories: categories
    })
});


//My-orders page for user
userRouter.get('/my-orders', authMiddleware, async function (req, res) {
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

userRouter.post('/confirmPayment', authMiddleware, async function (req, res) {

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

module.exports = userRouter;