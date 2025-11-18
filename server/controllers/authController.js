const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

module.exports.userLogin = async (req, res) => {
  try {
    console.log("Login attempt received:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Invalid password attempt for:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.lastLogin = new Date();
    await user.save();

    console.log("Login successful for:", username);

    return res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error("Login controller error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
