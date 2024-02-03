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

app.get('/user', function(req, res) {

});

app.get('/admin', function(req, res) {

});

app.use(function(req, res, err) {
    console.log("some error occured");
});

app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});