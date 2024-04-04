const mongoose = require('mongoose');

const url = "mongodb+srv://siddhantmvishnu:PBLproject@messmanagement.ii1mv9k.mongodb.net/";

mongoose.connect(url);

const userSchema = new mongoose.Schema({
    data: {
        firstname: String,
        lastname: String,
        mobile: String,
        email: String,
        password: String
    },
    myOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ORDERS"
    }]
})

const adminSchema = new mongoose.Schema({
    data: {
        firstname: String,
        lastname: String,
        mobile: Number,
        email: String,
        password: String
    },
})

const menuSchema = new mongoose.Schema({
    title: String,
    ingredients: [String],
    price: Number,
    imageUrl: String
})

const ordersSchema = new mongoose.Schema({
    orderID: String,
    tokenNo: Number,
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MENU"
        },
        quantity: Number
    }],
    status: String,
})

const USER = mongoose.model('User', userSchema);
const ADMIN = mongoose.model('Admin', adminSchema);
const MENU = mongoose.model('Menu', menuSchema);
const ORDERS = mongoose.model('My-Orders', ordersSchema);

module.exports = {
    USER, ADMIN, MENU, ORDERS
}