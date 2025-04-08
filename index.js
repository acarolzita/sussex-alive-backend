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

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://sussex-alive.vercel.app"  // Updated CORS setting
}));
app.use(helmet());

// Create HTTP server and attach Socket.io with updated CORS config
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://sussex-alive.vercel.app",
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("sendMessage", async (data) => {
    console.log("Received message via Socket.io:", data);
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

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});












  
