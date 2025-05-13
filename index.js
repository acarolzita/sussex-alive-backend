// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoutes"); // public
const profileRouter = require("./routes/profile"); // protected
const postsRouter = require("./routes/posts");     // protected
const messagesRouter = require("./routes/messages"); // protected

const authenticateToken = require("./middlewares/firebaseAuth");

const app = express();
const PORT = process.env.PORT || 10000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://sussex-alive.vercel.app";

// Middleware
app.use(helmet());
app.use(express.json());

// ✅ CORS setup
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors()); // Preflight support

// ✅ Public route (no auth)
app.use("/api/auth", userRoutes);

// ✅ Protected routes (Firebase token required)
app.use("/api/profile", authenticateToken, profileRouter);
app.use("/api/posts", authenticateToken, postsRouter);
app.use("/api/messages", authenticateToken, messagesRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ✅ WebSocket setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Socket message received:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});


















  
