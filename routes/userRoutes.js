// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Optional: global CORS preflight route for /register
router.options("/register", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

// POST /api/users/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // Enforce Sussex-only email addresses (optional)
  if (!email.endsWith("@sussex.ac.uk")) {
    return res.status(403).json({ error: "Only Sussex University emails allowed." });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Optionally save to Firestore user profile
    const db = admin.firestore();
    await db.collection("users").doc(userRecord.uid).set({
      email: userRecord.email,
      name: "", // Will be editable later
      bio: "",
      profilePic: "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;



