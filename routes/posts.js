// routes/posts.js
const express = require("express");
const router = express.Router();

// GET /api/posts
router.get("/", (req, res) => {
  // For now, return a simple static array of posts or an empty array
  const posts = [
    {
      id: 1,
      title: "Test Post",
      content: "Hello world!",
      author: "Admin",
      createdAt: new Date().toISOString()
    }
  ];

  res.json(posts);
});

// Optionally, define more routes for creating, editing, or deleting posts...

module.exports = router;

