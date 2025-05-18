const admin = require("firebase-admin");

if (!admin.apps.length) {
  try {
    const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountRaw) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is missing.");
    }

    const serviceAccount = JSON.parse(serviceAccountRaw);

    if (!serviceAccount.project_id) {
      throw new Error("Missing 'project_id' in parsed service account. Check your .env formatting.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin initialized successfully");
  } catch (err) {
    console.error("❌ Firebase Admin initialization failed:", err.message);
  }
}

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // You now have access to req.user.uid, etc.
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authenticateToken;






