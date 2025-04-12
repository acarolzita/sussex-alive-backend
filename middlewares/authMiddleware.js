// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

function authenticateToken(req, res, next) {
  // This line retrieves the value of the Authorization header.
  const authHeader = req.headers["authorization"];
  
  // This line splits the header into two parts: "Bearer" and the actual token.
  // It expects the header to be in the format "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

