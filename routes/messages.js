// backend/routes/messages.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// GET /api/messages
// Retrieves all messages, optionally filtered by senderId and receiverId query parameters.
router.get("/", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    let filter = {};
    
    // If both senderId and receiverId are provided, fetch messages exchanged between the two users.
    if (senderId && receiverId) {
      filter.OR = [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ];
    } else {
      // Optionally, filter by senderId or receiverId individually if provided.
      if (senderId) {
        filter.senderId = senderId;
      }
      if (receiverId) {
        filter.receiverId = receiverId;
      }
    }
    
    const messages = await prisma.message.findMany({
      where: filter,
      include: { sender: true, receiver: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/messages
// Creates a new message.
router.post("/", async (req, res) => {
  try {
    const { text, senderId, receiverId } = req.body;
    if (!text || !senderId || !receiverId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newMessage = await prisma.message.create({
      data: { text, senderId, receiverId },
    });
    res.json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

module.exports = router;

