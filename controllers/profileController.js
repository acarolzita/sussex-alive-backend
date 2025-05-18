// controllers/profileController.js

const admin = require("firebase-admin");
const db = admin.firestore();

// GET /api/profile/:userId
async function getProfile(req, res) {
  try {
    const { userId } = req.params;
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userDoc.data();
    res.json({
      id: userId,
      email: user.email || "",
      name: user.name || "",
      bio: user.bio || "",
      profilePic: user.profilePic || "",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

// PUT /api/profile/:userId
async function updateProfile(req, res) {
  try {
    const { userId } = req.params;
    const { name, bio, profilePic } = req.body;

    const userRef = db.collection("users").doc(userId);
    await userRef.set(
      {
        name,
        bio,
        profilePic,
      },
      { merge: true } // only update specified fields
    );

    const updatedDoc = await userRef.get();
    res.json({ id: userId, ...updatedDoc.data() });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};

