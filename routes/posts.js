// routes/posts.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import your authentication middleware to protect the POST route.
const authenticateToken = require('../middlewares/authMiddleware');

// GET /api/posts: Fetch all posts from the database.
// This is a public route (no token required), but you can choose to protect it if desired.
router.get('/', async (req, res) => {
  try {
    // Retrieve posts; optionally include related user data.
    const posts = await prisma.post.findMany({
      include: {
        user: { 
          select: { 
            id: true, 
            name: true, 
            email: true 
          } 
        },
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/posts: Create a new post.
// This is a protected route—only authenticated users (with a valid JWT) can create a post.
router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  // Validate that title and content are provided.
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  // Extract the userId from the token payload.
  // Ensure your token contains userId when signing (e.g., jwt.sign({ userId: user.id }, ...))
  const userId = req.user.userId;

  try {
    // Create a new post in the database using Prisma.
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        userId, // Associate this post with the authenticated user.
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;






