// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profile");

const app = express();

// ✅ Allow CORS from your frontend domain
app.use(cors({
  origin: "https://sussex-alive.vercel.app", // FRONTEND URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

app.use("/api/auth", userRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

