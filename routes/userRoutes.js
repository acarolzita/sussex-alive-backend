// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();

// Example public route (register)
router.post("/register", (req, res) => {
  // handle user registration
  res.status(200).json({ message: "User registered" });
});

module.exports = router;
