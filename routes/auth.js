// routes/auth.js
const express = require("express");
const router = express.Router();

// Import controller functions for authentication
const { registerUser, loginUser } = require("../controllers/authController");

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

module.exports = router;

