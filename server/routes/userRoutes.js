import express from "express";
import { changePassword } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
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
//Change password route
router.put("/change-password", verifyToken, changePassword);
export default router;
module.exports = router;