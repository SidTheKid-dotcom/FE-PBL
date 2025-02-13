require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI || '';

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
    data: {
        name: String,
        mobile: String,
        email: String,
        password: String
    },
    myOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "My-Orders"
    }]
})

const adminSchema = new mongoose.Schema({
    data: {
        name: String,
        mobile: Number,
        email: String,
        password: String
    },
})

const ordersSchema = new mongoose.Schema({
    orderID: String,
    tokenNo: Number,
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        },
        quantity: Number
    }],
    price: Number,
    status: String,
})

const menuSchema = new mongoose.Schema({
    title: String,
    ingredients: [String],
    price: Number,
    imageUrl: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
    }
})

const categorySchema = new mongoose.Schema({
    name: String
})

const feedbackSchema = new mongoose.Schema({
    rating: Number,
    type: String,
    feedback: String,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const USER = mongoose.model('User', userSchema);
const ADMIN = mongoose.model('Admin', adminSchema);
const MENU = mongoose.model('Menu', menuSchema);
const ORDERS = mongoose.model('My-Orders', ordersSchema);
const CATEGORIES = mongoose.model('Categories', categorySchema);
const FEEDBACK = mongoose.model('Feedback', feedbackSchema);

module.exports = {
    USER, ADMIN, MENU, ORDERS, CATEGORIES, FEEDBACK
}