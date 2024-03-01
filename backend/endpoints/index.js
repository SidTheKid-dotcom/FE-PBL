const express = require('express');
const app = express();
const cors = require('cors');

const mainRouter = require('./routes/index.js');

const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);

app.use(function(req, res, err) {
    console.log("some error occured");
});

app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});