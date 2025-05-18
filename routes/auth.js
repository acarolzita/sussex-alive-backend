const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof displayName !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input types" });
  }

  if (!email.endsWith("@sussex.ac.uk")) {
    return res.status(403).json({ error: "Only Sussex University emails are allowed." });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });

    return res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Optional: Login route (should use client SDK)
router.post("/login", (req, res) => {
  return res.status(501).json({ message: "Use Firebase client SDK to login." });
});

module.exports = router;

