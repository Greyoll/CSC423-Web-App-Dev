const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema ({
    id: Number,
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    role: String,
    lastLogin: Date,
    lastPasswordChange: Date 
});
module.exports = mongoose.model("User", userSchema);