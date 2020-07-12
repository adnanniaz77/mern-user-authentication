const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//========================================
//              REGISTER ROUTE
//========================================

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, checkPassword } = req.body;

        // register input validation

        if (!username || !email || !password || !checkPassword)
            return res
                .status(400)
                .json({ msg: "Please fill out all the fields" });

        if (username.length < 5)
            return res.status(400).json({
                msg: "User's name length must be at least 5 characters",
            });

        if (email.length < 5)
            return res
                .status(400)
                .json({ msg: "Email length must be at least 5 characters" });

        if (password.length < 5)
            return res
                .status(400)
                .json({ msg: "Password length must be at least 5 characters" });

        if (password !== checkPassword)
            return res.status(400).json({
                msg:
                    "Passwords do not match, please provide matching passwords",
            });

        // check for existing user
        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "Account with this email already exists" });

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

//========================================
//              LOGIN ROUTE
//========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // login input validation

        if (!email || !password)
            return res
                .status(400)
                .json({ msg: "Please fill out all the fields" });

        if (email.length < 5)
            return res
                .status(400)
                .json({ msg: "Email length must be at least 5 characters" });

        if (password.length < 5)
            return res
                .status(400)
                .json({ msg: "Password length must be at least 5 characters" });

        // check if user has an account

        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json({
                msg: "No account found with this email, please register",
            });

        // comparing the passwords

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

        // issue jwt token for current user

        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

//========================================
//              DELETE ROUTE
//========================================

router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//========================================
// General user valid user verification
//========================================

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id,
    });
});

module.exports = router;
