// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma'); // adjust the path based on your project structure
const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

// User registration route
router.post('/register', async (req, res) => {
  const { name, email, password, studentId, bio } = req.body;

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the user record
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Make sure your User model in Prisma schema has a `studentId` field
        studentId,
        bio,
      },
    });

    // Optionally, create and return a JWT right away
    const token = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
