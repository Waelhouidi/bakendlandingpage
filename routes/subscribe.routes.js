const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber.model');
const nodemailer = require('nodemailer');
require('dotenv').config();





// Notify subscribers about a new blog post
router.post('/notify', async (req, res) => {
  try {
    // Updated to match Angular's payload
    const { title, content } = req.body;
    const subscribers = await Subscriber.find({});

    // Send emails concurrently
    const emailPromises = subscribers.map((subscriber) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: `New Blog Post: ${title}`,
        html: `<h1>${title}</h1>
               <p>${content}</p>
               <p>Thank you for being a valued subscriber!</p>`,
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'Failed to send notifications' });
  }
});

router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find({});
    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
});

router.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email',
      text: 'This is a test email.',
    });
    res.send('Test email sent successfully!');
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).send('Failed to send test email.');
  }
});

module.exports = router;
