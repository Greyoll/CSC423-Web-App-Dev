const express = require("express");
const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword
} = require("../controllers/userController");
const tokenValidator = require("../middleware/tokenValidator");

const router = express.Router();

// Create user 
router.post("/", tokenValidator, createUser);

// Get all users
router.get("/", tokenValidator, getAllUsers);

// Get specific user
router.get("/:id", tokenValidator, getUser);

// Update user
router.put("/:id", tokenValidator, updateUser);

// Delete user
router.delete("/:id", tokenValidator, deleteUser);

// Change password
router.put("/change-password", tokenValidator, changePassword);

module.exports = router;
