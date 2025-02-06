// routes/message.routes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const authMiddleware = require('../models/Middleware/auth');

// Submit message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all messages (admin only)
// Correct route definition
router.get('/', async (req, res) => {
    try {
      const messages = await Message.find();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;