const express = require('express');
const app = express();
const cors = require('cors');
const {createUser, createAdmin} = require('../zod/types.js');
const { USER, ADMIN } = require('../database/db.js');

const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', function(req, res) {
    
});

// Main user landing page endpoints
app.get('/user', function(req, res) {
    // 1. Main Menu db call
});

// My-Cart page for user
app.get('/user/my-cart', function(req, res) {
    // 1. My Cart db call
});

//My-orders page for user
app.get('/user/my-orders', function(req, res) {
    // 1. My order db call 
})

app.get('/admin', function(req, res) {

});

app.use(function(req, res, err) {
    console.log("some error occured");
});

app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});