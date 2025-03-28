const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// GET /api/posts
router.get("/", async (req, res) => {
  // ...
});

// POST /api/posts
router.post("/", async (req, res) => {
  // ...
});

module.exports = router;
