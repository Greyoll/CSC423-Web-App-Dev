const express = require("express");
const { createUser, getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const tokenValidator = require("../middleware/tokenValidator");

const router = express.Router();

// Create user 
router.post("/", tokenValidator, createUser);
// Get all users
router.get("/", tokenValidator, getAllUsers);
// Get specfic user
router.get("/:id", tokenValidator, getUser);
// Update user
router.put("/:id", tokenValidator, updateUser);
// Delete user
router.delete("/:id", tokenValidator, deleteUser);
// Change password for logged-in user
router.put("/change-password", tokenValidator, changePassword);

module.exports = router;
