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
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const message = await Message.findByIdAndDelete(req.params.id);
      
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ error: 'Invalid message ID' });
      }
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;