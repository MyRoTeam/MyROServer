const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true } 
});

module.exports = mongoose.model("User", userSchema);
