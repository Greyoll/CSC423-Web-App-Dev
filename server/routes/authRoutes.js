const express = require("express");
const router = express.Router();

const { userLogin } = require("../controllers/authController");

// Login route
router.post("/login", userLogin);

module.exports = router;