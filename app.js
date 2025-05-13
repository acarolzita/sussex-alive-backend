const express = require("express");
const cors = require("cors"); // ✅ required
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profile");

const app = express();

// ✅ Configure CORS: this is the critical part
app.use(cors({
  origin: "https://sussex-alive.vercel.app", // allow frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Optional: explicitly handle preflight requests (some servers need this)
app.options("*", cors());

app.use(bodyParser.json());

app.use("/api/auth", userRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});


