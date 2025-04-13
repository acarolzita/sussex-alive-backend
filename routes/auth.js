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
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// *******************
// Registration Endpoint
// *******************
// POST /api/auth/register
// Expects JSON body: { email, name, password, studentId }
router.post("/register", async (req, res) => {
  const { email, name, password, studentId } = req.body;

  // Basic validation: ensure email, name, password, and studentId are provided
  if (!email || !name || !password || !studentId) {
    return res.status(400).json({ error: "Missing email, name, password, or studentId." });
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
        studentId,
      },
    });

    // Optionally, you may not want to return sensitive info
    return res.status(201).json({
      message: "User registered successfully.",
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name, 
        studentId: newUser.studentId 
      },
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
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Log the secret for debugging purposes (remove or comment out in production)
    console.log("JWT_SECRET being used:", process.env.JWT_SECRET);

    // Sign a JWT token with the user's id; payload includes userId
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        studentId: user.studentId
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;






