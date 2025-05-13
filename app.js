const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profile");
const postsRoutes = require("./routes/posts");
const messagesRoutes = require("./routes/messages");

const app = express();

// ✅ Allow frontend from Vercel to call your backend
app.use(cors({
  origin: "https://sussex-alive.vercel.app",
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/messages", messagesRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Sussex-Alive Backend");
});

module.exports = app;
