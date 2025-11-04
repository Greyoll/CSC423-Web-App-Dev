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
        // Generate new id
        const last = await User.findOne().sort({ id: -1 });
        const newId = last ? last.id + 1 : 1;

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        const newUser = new User ({
            id: newId,
            firstName,
            lastName,
            username,
            password: hash,
            role,
            lastLogin: null,
            lastPasswordChange: new Date(),
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ error: "Serverside error" });
    }
};

// Get ALL users
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error has occured when trying to fetch users, check console" });
    }
};

// Get  a specfic user from their id
module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: "Error! No such user found" });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error has occurred, could not fetch the user" });
    }
};

// Update user (using their id)
module.exports.updateUser = async (req, res) => {
    try {
        const updates = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            updates,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Error! User not found" });
        }
        res.status(200).json({ message: "User updated", user: updatedUser});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error has occurred, could not update user"});
    }
};

// Delete user
module.exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ id: req.params.id });
        if (!deletedUser) {
            return res.status(404).json({ error: "Error! User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        console.error(err).status(500).json({ error: "Failed to delete user" });
    }
};