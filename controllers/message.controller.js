// messages.controller.js
exports.getMessages = async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      if (!messages || messages.length === 0) {
        return res.status(404).json({ message: 'No messages found' });
      }
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };