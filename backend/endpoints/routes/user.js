const express = require('express');
const userRouter = express.Router();

const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware.js');
const loginMiddleware = require('./loginMiddleware.js')
const { createUser } = require('../../zod/types.js');
const { USER, MENU, ORDERS } = require('../../database/db.js');

const JWT_SECRET = require("../../config.js");
const { default: mongoose } = require('mongoose');

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
        myCart: {
            fullThali: 0,
            halfThali1: 0,
            halfThali2: 0,
            halfThali3: 0
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
    const options = { expiresIn: '1h' };


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
    const options = { expiresIn: '1h' };

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
    const menuItems = await MENU.find();
    res.json({
        menu: menuItems
    })
});

//My-orders page for user
userRouter.get('/my-orders', authMiddleware, async function (req, res) {
    // 1. My order db call 
    const userID = req.userID;

    const user = await USER.findById(userID);

    if (!user) {
        return res.status(403).json({
            message: "User not found"
        })
    }

    const orderIDs = user.myOrders;

    if (!orderIDs) {
        return res.status(403).json({});
    }

    const orderPromises = orderIDs.map(orderID => ORDERS.findById(orderID)
        .populate('items.menuItem', '-_id title ingredients price', MENU));
    const orders = await Promise.all(orderPromises);

    return res.status(200).json({
        message: "Successful in fetching orders",
        orders: orders
    })
})

// Pay page for user
userRouter.post('/pay', authMiddleware, async function (req, res) {
    // 1. My Cart db call

    const order = req.body.order;

    // ADD MONGOOSE SESSION

    try {
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

        return res.json({
            message: "Order added successfully"
        });
    }
    catch (e) {
        return res.status(411).json("Error in adding order")
    }
});

module.exports = userRouter;