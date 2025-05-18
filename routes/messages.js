// routes/messages.js
const express = require("express");
const router = express.Router();
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const authenticateToken = require("../middlewares/authMiddleware");

const db = getFirestore();

// GET /api/messages?senderId=abc&receiverId=xyz
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Missing senderId or receiverId" });
    }

    const querySnapshot = await db
      .collection("messages")
      .where("participants", "array-contains", senderId)
      .orderBy("createdAt", "asc")
      .get();

    const messages = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        (data.senderId === senderId && data.receiverId === receiverId) ||
        (data.senderId === receiverId && data.receiverId === senderId)
      ) {
        messages.push({ id: doc.id, ...data });
      }
    });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/messages
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { text, senderId, receiverId } = req.body;

    if (!text || !senderId || !receiverId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = {
      text,
      senderId,
      receiverId,
      participants: [senderId, receiverId],
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("messages").add(message);

    res.status(201).json({ id: docRef.id, ...message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

module.exports = router;




