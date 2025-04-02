// controllers/profileController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get a user profile by userId
async function getProfile(req, res) {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, bio: true, profilePic: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

// Update a user's profile
async function updateProfile(req, res) {
  try {
    const { userId } = req.params;
    const { name, bio, profilePic } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, bio, profilePic },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
