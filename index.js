// backend/index.js
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

// Set up Helmet to secure HTTP headers
app.use(helmet());

// Configure CORS: Replace the origin with your deployed frontend URL
app.use(cors({
  origin: "https://sussex-alive-pi1h-773o4jrbq-acarolzitas-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Set up middleware to explicitly set Cache-Control header
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Create HTTP server and attach Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://sussex-alive-pi1h-773o4jrbq-acarolzitas-projects.vercel.app",
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    console.log("Received message via Socket.io:", data);
    // You can process and save the message in your DB here
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











  
