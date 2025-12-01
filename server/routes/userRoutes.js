const express = require("express");
const { createUser, getAllUsers, getUser, updateUser, deleteUser, changePassword } = require("../controllers/userController");
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
// Change password (self or admin)
router.put("/:id/password", tokenValidator, changePassword);
// Delete user
router.delete("/:id", tokenValidator, deleteUser);

module.exports = router;