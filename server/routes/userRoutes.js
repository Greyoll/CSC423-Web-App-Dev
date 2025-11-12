const express = require("express");
const router = express.Router();
const tokenValidator = require("../middleware/tokenValidator");
const userController = require("../controllers/userController");

// Create user
router.post("/", tokenValidator, userController.createUser);
// Get all users
router.get("/", tokenValidator, userController.getAllUsers);
// Get specific user
router.get("/:id", tokenValidator, userController.getUser);
// Update user
router.put("/:id", tokenValidator, userController.updateUser);
// Delete user
router.delete("/:id", tokenValidator, userController.deleteUser);
// Change password
router.put("/change-password", tokenValidator, userController.changePassword);

module.exports = router;

