// routes/posts.js

const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Firestore instance
const db = admin.firestore();

// Auth middleware
const authenticateToken = require("../middlewares/authMiddleware");

// GET /api/posts - Public route to fetch all posts
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();

    const posts = [];
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/posts - Protected route to create a post
router.post("/", authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const userId = req.user.userId;

  try {
    const newPostRef = db.collection("posts").doc();
    const newPost = {
      title,
      content,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await newPostRef.set(newPost);

    res.status(201).json({ id: newPostRef.id, ...newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;







