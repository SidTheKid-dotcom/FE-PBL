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
    content: {
        dryVeg: String,
        gravyVeg: String,
        rice: String,
        dal: String,
        chapati: String,
        salad: String
    }
})

const ordersSchema = new mongoose.Schema({
    orderID: String,
    tokenNo: Number,
    order: {
        fullThali: Number,
        halfThali1: Number,
        halfThali2: Number,
        halfThali3: Number
    },
    status: String,
})

const USER = mongoose.model('User', userSchema);
const ADMIN = mongoose.model('Admin', adminSchema);
const MENU = mongoose.model('Menu', menuSchema);
const ORDERS = mongoose.model('My-Orders', ordersSchema);

module.exports = {
    USER, ADMIN, MENU, ORDERS
}