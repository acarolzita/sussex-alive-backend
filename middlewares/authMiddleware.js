// middlewares/authMiddleware.js
const { getAuth } = require("firebase-admin/auth");

const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp();
}

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
