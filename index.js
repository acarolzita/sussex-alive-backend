// index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Import route files
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const postsRouter = require("./routes/posts");
const messagesRouter = require("./routes/messages");

const app = express();

// Environment variables
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

if (!CORS_ORIGIN) {
  console.warn("Warning: CORS_ORIGIN is not set in your environment!");
}

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN, 
  })
);
app.use(helmet());

// Create HTTP server & Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Received message via Socket.io:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Mount API routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postsRouter);
app.use("/api/messages", messagesRouter);

// Health check / root
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start server
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("Server closed gracefully");
    process.exit(0);
  });
});














  
