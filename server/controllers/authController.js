const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const SECRET = process.env.JWT_SECRET;

module.exports.userLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    if (!username || !password) {
        return res.status(400).json({error: "Missing fields"});
    }
    const user = await User.findOne({username});
    if (!user) {
        return res.status(401).json({error: "Invalid credentials"});
    }
    const checkPass = bcrypt.compare(password, user.password);
    if (!checkPass) {
        return res.status(401).json({error: "Invalid credentials"});
    }
    const token = jwt.sign(
          { id: user._id, username: user.username },
          SECRET,
          { expiresIn: "1h" }
        );
    user.lastLogin = new Date();
    await user.save();
    res.json({ message: "Login successful", token });
}