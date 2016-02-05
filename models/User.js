const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true } 
});

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.passwordHash;
    return obj;
};

module.exports = mongoose.model("User", UserSchema);
