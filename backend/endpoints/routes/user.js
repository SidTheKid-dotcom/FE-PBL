const express = require('express');
const userRouter = express.Router();

const jwt = require('jsonwebtoken');
const {createUser, createAdmin} = require('../zod/types.js');
const { USER, ADMIN, MENU, PENDING_ORDERS } = require('../database/db.js');

// Main user landing page endpoints
userRouter.get('/user', async function(req, res) {
    // 1. Main Menu db call
    const menuItems = await MENU.find();
    res.json({
        menu: menuItems
    })
});

// My-Cart page for user
userRouter.get('/user/my-cart', function(req, res) {
    // 1. My Cart db call
});

//My-orders page for user
userRouter.get('/user/my-orders', async function(req, res) {
    // 1. My order db call 
    const username = req.headers.username;
    const pendingOrdersOfUser = await PENDING_ORDERS.findOne({
        username: username
    })

    res.json({
        pendingOrders: pendingOrdersOfUser
    })
})


module.exports = userRouter;