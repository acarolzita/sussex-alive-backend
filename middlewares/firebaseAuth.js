// middlewares/firebaseAuth.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(), 
  // or if you have a private key file:
  // credential: admin.credential.cert(require("../path/to/your-firebase-adminsdk.json"))
});

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authenticateToken;

