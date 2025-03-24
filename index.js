// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Create HTTP server and attach Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, specify your frontend URL
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for a "message" event from clients
  socket.on("message", async (data) => {
    console.log("Message received:", data);
    
    // Example: Save a new post in the database.
    // data should include { content, userId } and optionally an id.
    try {
      const newPost = await prisma.post.create({
        data: {
          // Let the default UUID generation work if no id is provided
          content: data.content,
          userId: data.userId, // Ensure this user exists in your User table
        },
      });
      console.log("Post saved to DB:", newPost);
      // Emit the new post to all connected clients
      io.emit("message", newPost);
    } catch (error) {
      console.error("Error saving post:", error);
      // Optionally, emit an error event to the client if needed
      socket.emit("error", "Could not save post.");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// A simple Express route (optional)
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start the server on a specified port (default: 5001)
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});





  
