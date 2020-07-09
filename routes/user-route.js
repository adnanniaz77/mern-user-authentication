const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");

// register new user route
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, checkPassword } = req.body;

        // input validation

        if (!username || !email || !password || !checkPassword)
            return res
                .status(400)
                .json({ msg: "Please fill out all the fields" });

        if (username.length < 5)
            return res
                .status(400)
                .json({ msg: "username length must be at leat 5 characters" });

        if (email.length < 5)
            return res
                .status(400)
                .json({ msg: "email length must be at leat 5 characters" });

        if (password.length < 5)
            return res
                .status(400)
                .json({ msg: "password length must be at leat 5 characters" });

        if (password !== checkPassword)
            return res.status(400).json({
                msg:
                    "passwords do not match, please provide matching passwords",
            });

        // check for existing user
        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "account with this email already exists" });

        // password encryption
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// login route
router.post("/login", (req, res) => {
    res.send("login");
});

module.exports = router;
