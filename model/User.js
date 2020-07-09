const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: { type: String, min: 5, required: true },
    email: { type: String, min: 6, required: true, unique: true },
    password: { type: String, min: 5, required: true },
    confirmPassword: { type: String, min: 5, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
