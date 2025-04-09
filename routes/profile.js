// routes/profile.js
const express = require("express");
const router = express.Router();

// Import your Prisma Client instance
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Optionally, import your authentication middleware if you want to protect this route
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

module.exports = router;


