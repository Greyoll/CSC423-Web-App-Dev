const express = require("express");
const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  resetPassword
} = require("../controllers/userController");

const tokenValidator = require("../middleware/tokenValidator");
const router = express.Router();

// Admin-only CRUD
router.post("/", tokenValidator, createUser);
router.get("/", tokenValidator, getAllUsers);
router.get("/:id", tokenValidator, getUser);
router.put("/:id", tokenValidator, updateUser);
router.delete("/:id", tokenValidator, deleteUser);

// --------------------- Reset password (no token required) ---------------------
router.put("/reset-password", resetPassword);

module.exports = router;
