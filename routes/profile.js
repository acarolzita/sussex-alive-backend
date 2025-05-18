// routes/profile.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const authenticateToken = require("../middlewares/authMiddleware");

const db = admin.firestore();

// GET /api/profile/:id - Fetch user profile
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const userDoc = await db.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userDoc.data();
    const { email, name, bio = "", profilePic = "" } = user;

    res.json({ id, email, name, bio, profilePic });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/profile/:id - Update user profile
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, bio, profilePic } = req.body;

  // Match Firebase token payload fields
  const userId = req.user.uid || req.user.userId || req.user.user_id;

  if (userId !== id) {
    return res.status(403).json({ error: "You can only update your own profile." });
  }

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
    console.error("Error updating profile:", error.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;





