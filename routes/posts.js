// routes/posts.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middlewares/authMiddleware');

// GET /api/posts: Fetch all posts
router.get('/', async (req, res) => {
  try {
    // Optionally include associated user data (only essential fields)
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/posts: Create a new post (protected route)
router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  
  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  // Get userId from the token payload attached by auth middleware.
  // (Make sure your token payload includes a property like userId.)
  const userId = req.user.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        userId,  // Associates the post with the logged-in user.
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;





