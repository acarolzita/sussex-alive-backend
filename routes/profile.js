// routes/profile.js
const express = require("express");
const router = express.Router();

// Import your Prisma Client instance
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import your authentication middleware to protect these routes
const authenticateToken = require("../middlewares/authMiddleware");

// GET /api/profile/:id - Fetch a user profile by ID
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the user profile from your database, selecting only the fields you want to expose
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        profilePic: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/profile/:id - Update a user's profile (protected route)
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  // For security: ensure the logged in user is updating their own profile
  if (req.user.userId !== id) {
    return res.status(403).json({ message: "You can only update your own profile." });
  }
  
  const { name, bio, profilePic } = req.body;
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, bio, profilePic },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        profilePic: true,
      },
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;



