const admin = require("firebase-admin");

if (!admin.apps.length) {
  try {
    const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountRaw) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT env variable is missing.");
    }

    const serviceAccount = JSON.parse(serviceAccountRaw);

    if (!serviceAccount.project_id) {
      throw new Error("Parsed service account is missing 'project_id'. Check your .env formatting.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log("✅ Firebase Admin initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", err.message);
  }
}

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
    console.error("Firebase token verification failed:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authenticateToken;





