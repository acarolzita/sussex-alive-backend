// controllers/authController.js

const admin = require("firebase-admin");

// Register a new user
async function registerUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password." });
    }

    if (!email.endsWith("@sussex.ac.uk")) {
      return res.status(400).json({ error: "Only Sussex University emails are allowed." });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    res.status(201).json({ message: "User registered", uid: userRecord.uid });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: error.message || "Registration failed." });
  }
}

// Log in is handled client-side with Firebase Auth SDK, not on backend
async function loginUser(req, res) {
  return res.status(405).json({ error: "Login is handled on the client with Firebase Auth." });
}

module.exports = {
  registerUser,
  loginUser,
};

