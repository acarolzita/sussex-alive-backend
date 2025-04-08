// routes/posts.js
const express = require('express');
const router = express.Router();

// Example: Return a hard-coded array of posts for testing
router.get('/', (req, res) => {
  // You can replace this with a database query once basic functionality works
  const posts = [
    {
      id: 1,
      title: 'Test Post',
      content: 'This is a sample post content.',
      author: 'John Doe',
      createdAt: new Date().toISOString(),
    }
  ];
  res.json(posts);
});

module.exports = router;


