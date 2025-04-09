// app.js
require('dotenv').config(); // Loads variables from .env file
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Use express.json() to parse JSON bodies into JS objects
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Dummy user data for demonstration - in a real app, check against your database!
const userData = {
  username: 'user1',
  password: 'password123'
};

// Login endpoint to authenticate the user and generate a token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if credentials match (replace with proper validation in production)
  if (username === userData.username && password === userData.password) {
    // Create a simple payload. You can include additional data as necessary.
    const payload = { username: username };

    // Sign the token, set it to expire in 1 hour
    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    // Respond with the token
    return res.json({ token });
  }

  // Invalid credentials response
  res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to verify the JWT token in protected routes
function authenticateToken(req, res, next) {
  // Tokens are typically sent in the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expects 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    // Attach the decoded payload to the request object for future use
    req.user = decoded;
    next();
  });
}

// A protected route example that requires a valid token
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data.', user: req.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
