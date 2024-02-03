const mongoose = require('mongoose');

const url = "mongodb+srv://siddhantmvishnu:PBLproject@messmanagement.ii1mv9k.mongodb.net/";

mongoose.connect(url);

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    mobile: Number,
    email: String,
    password: String
})

const adminSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    mobile: Number,
    email: String,
    password: String
})

const USER = mongoose.model('User',userSchema);
const ADMIN = mongoose.model('Admin', adminSchema);

module.exports = {
    USER, ADMIN
}