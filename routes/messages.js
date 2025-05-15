// backend/routes/messages.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// GET /api/messages
// Retrieves all messages, optionally filtered by senderId and receiverId query parameters.
router.get("/", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    let query = db.collection("messages");

    if (senderId && receiverId) {
      // Fetch all messages between the two users (both directions)
      const snapshot = await query
        .where("participants", "array-contains", senderId)
        .orderBy("createdAt", "asc")
        .get();

      const messages = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => msg.participants.includes(receiverId));

      return res.json(messages);
    }

    // If filtering by just one user
    if (senderId) {
      query = query.where("senderId", "==", senderId);
    }
    if (receiverId) {
      query = query.where("receiverId", "==", receiverId);
    }

    const snapshot = await query.orderBy("createdAt", "asc").get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/messages
// Creates a new message
router.post("/", async (req, res) => {
  try {
    const { text, senderId, receiverId } = req.body;

    if (!text || !senderId || !receiverId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = {
      text,
      senderId,
      receiverId,
      participants: [senderId, receiverId],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("messages").add(newMessage);
    res.status(201).json({ id: docRef.id, ...newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

module.exports = router;


