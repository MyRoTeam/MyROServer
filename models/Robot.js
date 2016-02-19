const mongoose = require("mongoose");

var RobotSchema = new mongoose.Schema({
    name: { type: String, required: true },
    udid: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Robot", RobotSchema);

