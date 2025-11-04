const express = require("express");
const { createUser, getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const jwt = require("jsonwebtoken");

const router = express.router();

// Validate the token
const tokenValidator = (req, res, next) => {
    try {
        // This will look like: "Authorization: Bearer <token>"
        const authHeader = req.headers.authorization;

        // No token found
        if (!authHeader) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // Remove Bearer from authHeader
        const token = authHeader.split(" ")[1];

        // Make sure the formatted correctly
        if (!token) {
            return res.status(401).json({ error: "Invalid format for token" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Leave decoded data in user data so it can be used later
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid/expired token" });
    }
}

// Create user 
router.put("/users", tokenValidator, createUser);
// Get all users
router.get("/", tokenValidator, getAllUsers);
// Get specfic user
router.get("/:id", tokenValidator, getUser);
// Update user
router.put("/:id", tokenValidator, updateUser);
// Delete user
router.delete("/:id", tokenValidator, deleteUser);

modules.exports = router;