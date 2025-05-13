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

// ✅ CORS Configuration
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Explicit preflight

app.use(express.json());

// ✅ Routes
app.use("/api/auth", userRoutes); // Public
app.use("/api/profile", authenticateToken, profileRouter); // Protected
app.use("/api/posts", authenticateToken, postsRouter);     // Protected
app.use("/api/messages", authenticateToken, messagesRouter); // Protected

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ✅ Socket.io Setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("sendMessage", (data) => io.emit("message", data));
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});



















  
