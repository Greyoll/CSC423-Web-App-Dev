const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// --------------------- CREATE USER (Admins only) ---------------------
module.exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can create new users" });
    }

    const { firstName, lastName, username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    // Check if user exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "User with that username already exists" });
    }

    // Generate new ID
    const last = await User.findOne().sort({ id: -1 });
    const newId = last ? last.id + 1 : 1;

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
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
    res.status(200).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Server-side error", details: err.message });
  }
};

// --------------------- GET ALL USERS ---------------------
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// --------------------- GET SPECIFIC USER ---------------------
module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user" });
  }
};

// --------------------- UPDATE USER ---------------------
module.exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user" });
  }
};

// --------------------- DELETE USER ---------------------
module.exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// --------------------- CHANGE PASSWORD ---------------------
module.exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from tokenValidator
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both current and new password" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.lastPasswordChange = new Date();
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error changing password" });
  }
};
