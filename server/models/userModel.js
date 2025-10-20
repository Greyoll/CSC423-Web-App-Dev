const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema ({
    id: {type: Number, required: true, unique: true},
    firstName: {type: String, required: [true, "Enter the first name"]},
    lastName: {type: String, required: [true, "Enter the last name"]},
    username: {type: String, required: [true, "Enter a username"], unique: true},
    password: {type: String, required: [true, "Enter a password"]},
    role: {type: String, enum: ["admin", "doctor", "patient"]},
    lastLogin: Date,
    lastPasswordChange: Date 
});
module.exports = mongoose.model("User", userSchema);