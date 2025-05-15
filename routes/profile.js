// routes/profile.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const authenticateToken = require("../middlewares/authMiddleware");

// Firestore reference
const db = admin.firestore();

// GET /api/profile/:id
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const userDoc = await db.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userDoc.data();

    // Only return public fields
    const { email, name, bio, profilePic } = user;
    res.json({ id, email, name, bio, profilePic });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/profile/:id
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.userId !== id) {
    return res.status(403).json({ message: "You can only update your own profile." });
  }

  const { name, bio, profilePic } = req.body;

  try {
    const userRef = db.collection("users").doc(id);

    await userRef.update({
      ...(name && { name }),
      ...(bio && { bio }),
      ...(profilePic && { profilePic }),
    });

    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();

    res.json({ id, ...updatedData });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;




