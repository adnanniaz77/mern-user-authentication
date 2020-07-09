const express = require("express");
const router = express.Router();
const user = require("../model/User");

// register new user route
router.post("/register", (req, res) => {});

// login route
router.post("/login", (req, res) => {
    res.send("login");
});

module.exports = router;
