// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Import routers
const profileRouter = require("./routes/profile");
const postsRouter = require("./routes/posts");
const messagesRouter = require("./routes/messages");

// Import Firebase token middleware
const authenticateToken = require("./middlewares/firebaseAuth");

const app = express();

// Environment variables
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Basic security and parsing middleware
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

// Create HTTP server and setup Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// WebSocket for messaging
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Received message via socket:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Routes (now PROTECTED with Firebase Auth!)
app.use("/api/profile", authenticateToken, profileRouter);
app.use("/api/posts", authenticateToken, postsRouter);
app.use("/api/messages", authenticateToken, messagesRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received: closing server...");
  server.close(() => {
    console.log("Server closed gracefully.");
    process.exit(0);
  });
});
















  
