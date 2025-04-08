// routes/auth.js

const express = require("express");
const router = express.Router();

// Import PrismaClient from Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import bcrypt for password hashing
const bcrypt = require("bcrypt");

// Import jsonwebtoken to sign tokens
const jwt = require("jsonwebtoken");

// Read your JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Ensure you set JWT_SECRET in your .env file

// *******************
// Registration Endpoint
// *******************
// POST /api/auth/register
// Expects JSON body: { email, name, password }
router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  // Basic validation: ensure email, name, and password are provided
  if (!email || !name || !password) {
    return res.status(400).json({ error: "Missing email, name, or password." });
  }

  try {
    // Check if the user already exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash the password with bcrypt (using 10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Optionally, you may not want to return sensitive info
    return res.status(201).json({
      message: "User registered successfully.",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// *******************
// Login Endpoint
// *******************
// POST /api/auth/login
// Expects JSON body: { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation: check for email and password
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password." });
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // If the user isn't found, authentication fails
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If password doesn't match, authentication fails
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Sign a JWT token with the user's id (and optionally other details)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "Login successful.",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;


