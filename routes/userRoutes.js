// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// CORS preflight handler (optional, usually handled globally)
router.options("/register", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://sussex-alive.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

// ✅ Firebase-powered registration
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


