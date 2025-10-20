//Login Auth endpoints
const loginUser = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router.post("/login", loginUser);

model.exports = router;