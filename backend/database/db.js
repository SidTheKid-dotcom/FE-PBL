const mongoose = require('mongoose');

const url = "mongodb+srv://siddhantmvishnu:PBLproject@messmanagement.ii1mv9k.mongodb.net/";

mongoose.connect(url);

const userSchema = new mongoose.Schema({
    data: {
        firstname: String,
        lastname: String,
        mobile: Number,
        email: String,
        password: String
    },
    myCart: {
        fullThali: Number,
        halfThali1: Number,
        halfThali2: Number,
        halfThali3: Number
    },
    myOrders: {
        fullThali: Number,
        halfThali1: Number,
        halfThali2: Number,
        halfThali3: Number
    }
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
    fullThali: {
        dryVeg: String,
        gravyVeg: String,
        rice: String,
        dal: String,
        chapati: String,
        salad: String
    },
    halfThali1: {
        dryVeg: String,
        chapati: String,
        salad: String
    },
    halfThali2: {
        gravyVeg: String,
        chapati: String,
        salad: String
    },
    halfThali3: { 
        rice: String,
        dal: String,
        salad: String
    }
})

const pendingOrderSchema = new mongoose.Schema({
    username: String,
    otp: Number,
    order: {
        fullThali: Number,
        halfThali1: Number,
        halfThali2: Number,
        halfThali3: Number
    }
})

const USER = mongoose.model('User',userSchema);
const ADMIN = mongoose.model('Admin', adminSchema);
const MENU = mongoose.model('Menu', menuSchema);
const PENDING_ORDERS = mongoose.model('Pending-Orders', pendingOrderSchema);

module.exports = {
    USER, ADMIN, MENU, PENDING_ORDERS
}