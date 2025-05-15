// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Routes
const userRoutes = require("./routes/userRoutes");        // public
const profileRouter = require("./routes/profile");        // protected
const postsRouter = require("./routes/posts");            // protected
const messagesRouter = require("./routes/messages");      // protected

// Firebase middleware
const authenticateToken = require("./middlewares/firebaseAuth");

const app = express();
const PORT = process.env.PORT || 10000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://sussex-alive.vercel.app";

// Middleware
app.use(helmet());
app.use(express.json());

// ✅ Full CORS setup (including preflight OPTIONS support)
app.use(cors({
  origin: "https://sussex-alive.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors()); // Important for handling preflight

// ✅ Public routes
app.use("/api/auth", userRoutes);

// ✅ Protected routes
app.use("/api/profile", authenticateToken, profileRouter);
app.use("/api/posts", authenticateToken, postsRouter);
app.use("/api/messages", authenticateToken, messagesRouter);

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).send("✅ Backend is running and CORS is configured.");
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
  console.log("🔌 Socket connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("💬 Socket message received:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down...");
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
});



















  
