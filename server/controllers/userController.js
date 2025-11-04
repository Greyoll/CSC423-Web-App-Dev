const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// Create user function, this is only for admins
module.exports.createUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can create new users" });
        }

        const { firstName, lastName, username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ error: "Please enter all fields" });
        }

        // check that there is no prexisting user with that username
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(409).json({ error: "User with that username already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User ({
            firstName,
            lastName,
            username,
            password: hash,
            role,
            lastLogin: null,
            lastPasswordChange: new Date(),
        });

        await newUser.save();
        res.json({ message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ error: "Serverside error" });
    }
};