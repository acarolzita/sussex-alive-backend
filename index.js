// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Import route files from the routes folder
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const postsRouter = require("./routes/posts");
const messagesRouter = require("./routes/messages");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create HTTP server and attach Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace "*" with your frontend URL for added security.
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling (adjust as needed)
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Example: Listen for a "sendMessage" event to broadcast messages
  socket.on("sendMessage", async (data) => {
    console.log("Received message via Socket.io:", data);
    // Here, you might want to process and save the message in your DB.
    // Then broadcast it to all connected clients.
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Register API routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postsRouter);
app.use("/api/messages", messagesRouter);

// Root test route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start the server on the designated port
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});








  
