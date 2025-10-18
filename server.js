require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "mysecretkey";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Registration route
app.post("/api/users/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send("Username already exists.");

    const user = new User({ username, password });
    await user.save();
    res.status(201).send("User registered successfully.");
  } catch (err) {
    res.status(500).send("Error registering user.");
  }
});

// Login route
app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).send("Invalid credentials.");
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send("Server error.");
  }
});

// Default route (serve login page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ValdezLogin.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
