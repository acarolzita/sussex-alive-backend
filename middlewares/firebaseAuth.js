// middleware/firebaseAuth.js
const admin = require('firebase-admin');

// Make sure you initialized admin somewhere before
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // or admin.credential.cert(serviceAccount)
});

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = authenticateToken;
