// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");

// Load JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("⚠️  Warning: JWT_SECRET is not set in environment variables!");
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access token missing" });
  }

  // Expect header format: "Bearer <token>"
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Invalid Authorization header format" });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.error("Token verification error:", err);
      return res
        .status(403)
        .json({ message: "Invalid or expired access token" });
    }

    // Attach decoded token payload to req.user
    // Normalize userId (your token might have { userId } or { id })
    req.user = {
      userId: payload.userId || payload.id,
      ...payload,
    };

    next();
  });
}

module.exports = authenticateToken;


