const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require("morgan");
require("dotenv").config();

// connection to database
require("dotenv").config();

const mongoose = require("mongoose");
mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(err));

// middleware
app.use(express.json());

// testing
app.get("/", (req, res) => {
    res.send("Welcome");
});

// listening on port 5000
app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});
