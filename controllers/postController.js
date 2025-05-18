// controllers/postController.js

const admin = require("firebase-admin");
const db = admin.firestore();

// Create a new post (protected route)
async function createPost(req, res) {
  try {
    const { title, content } = req.body;
    const userId = req.user.uid;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const newPostRef = await db.collection("posts").add({
      title,
      content,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const newPost = await newPostRef.get();
    res.status(201).json({ id: newPost.id, ...newPost.data() });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
}

// Get all posts (public route)
async function getPosts(req, res) {
  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}

module.exports = {
  createPost,
  getPosts,
};
