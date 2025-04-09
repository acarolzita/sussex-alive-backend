// routes/posts.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middlewares/authMiddleware');

// GET /api/posts: Fetch all posts from the database
router.get('/', async (req, res) => {
  try {
    // Fetch posts along with the associated user (if needed)
    const posts = await prisma.post.findMany({
      include: {
        user: true, // Optional: include associated user data
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
  
  // Access the user's id from the token payload, as set in your auth middleware.
  // Ensure that when signing the JWT (in your login endpoint) you include the user's id as "userId"
  const userId = req.user.userId; // or req.user.id if that's how you named it
  
  // Validate that title and content are provided
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    // Create a new post in the database with Prisma
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        userId, // Associate the post with the logged-in user
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;



