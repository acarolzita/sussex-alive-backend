require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Import routers
const userRoutes = require("./routes/userRoutes");
const profileRouter = require("./routes/profile");
const postsRouter = require("./routes/posts");
const messagesRouter = require("./routes/messages");

// Import Firebase token middleware
const authenticateToken = require("./middlewares/firebaseAuth");

const app = express();

// Environment variables
const PORT = process.env.PORT || 10000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://sussex-alive.vercel.app";

// ✅ Define a consistent CORS config
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // optional if you're sending cookies or auth headers
};

// ✅ Apply CORS correctly
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight with same config

// Security and body parsing
app.use(helmet());
app.use(express.json());

// Public routes
app.use("/api/auth", userRoutes);

// Protected routes
app.use("/api/profile", authenticateToken, profileRouter);
app.use("/api/posts", authenticateToken, postsRouter);
app.use("/api/messages", authenticateToken, messagesRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// WebSocket setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Received message:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});


















  
