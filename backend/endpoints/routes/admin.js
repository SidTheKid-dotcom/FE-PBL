const express = require('express');
const adminRouter = express.Router();

const jwt = require('jsonwebtoken');
const {createUser, createAdmin} = require('../zod/types.js');
const { USER, ADMIN, MENU, PENDING_ORDERS } = require('../database/db.js');

adminRouter.get('/admin', function(req, res) {

});

module.exports = adminRouter;