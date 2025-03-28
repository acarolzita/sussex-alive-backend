// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Import your routes from the routes folder
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
    origin: "*", // Replace "*" with your frontend URL in production for added security
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling (optional, adjust based on your needs)
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // You can listen for socket events and handle them here if needed.
  socket.on("message", (data) => {
    console.log("Socket message received:", data);
    // Optionally, you could broadcast or process the message
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Use your route files for API endpoints
app.use("/api/posts", postsRouter);
app.use("/api/messages", messagesRouter);

// Root route (for testing)
app.get("/api/messages", async (req, res) => {
  res.send("Backend server is running!");
});

// Start the server on the port provided by the environment or fallback to 5001
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});







  
