// controllers/messageController.js

const admin = require("firebase-admin");
const db = admin.firestore();

// Send a new message
async function sendMessage(req, res) {
  try {
    const { text, receiverId } = req.body;
    const senderId = req.user.uid;

    if (!text || !receiverId) {
      return res.status(400).json({ error: "Missing text or receiverId." });
    }

    const newMessageRef = await db.collection("messages").add({
      text,
      senderId,
      receiverId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const newMessage = await newMessageRef.get();

    res.status(201).json({ id: newMessageRef.id, ...newMessage.data() });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
}

// Get all messages between the authenticated user and a specific receiver
async function getMessages(req, res) {
  try {
    const userId = req.user.uid;
    const receiverId = req.query.receiverId;

    if (!receiverId) {
      return res.status(400).json({ error: "Missing receiverId in query." });
    }

    const messagesRef = db
      .collection("messages")
      .where("senderId", "in", [userId, receiverId])
      .where("receiverId", "in", [userId, receiverId])
      .orderBy("createdAt", "asc");

    const snapshot = await messagesRef.get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
}

module.exports = {
  sendMessage,
  getMessages,
};
