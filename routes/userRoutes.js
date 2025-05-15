// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();

// CORS preflight handler for /register
router.options("/register", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://sussex-alive.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204); // No Content
});

// Actual POST register route
router.post("/register", (req, res) => {
  // Handle user registration logic here
  res.status(200).json({ message: "User registered" });
});

module.exports = router;

