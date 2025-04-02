// routes/profile.js
const express = require("express");
const router = express.Router();

// Import controller functions for profile management
const { getProfile, updateProfile } = require("../controllers/profileController");

// Import authentication middleware to protect these routes
const authenticateToken = require("../middlewares/authMiddleware");

// Get a user's profile (protected route)
router.get("/:userId", authenticateToken, getProfile);

// Update a user's profile (protected route)
router.put("/:userId", authenticateToken, updateProfile);

module.exports = router;

