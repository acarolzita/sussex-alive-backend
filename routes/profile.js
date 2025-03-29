// routes/profile.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get user profile
router.get("/:userId", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: { id: true, email: true, name: true, bio: true, profilePic: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update profile
router.put("/:userId", async (req, res) => {
  try {
    const { name, bio, profilePic } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.params.userId },
      data: { name, bio, profilePic },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
