const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber.model');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Subscribe route
router.post('', async (req, res) => {
  try {
    const { email } = req.body;

    // Save to database
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send welcome email
    const welcomeMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Our Blog!',
      html: `<h1>Thank you for subscribing!</h1>
             <p>You've successfully subscribed to our blog. Stay tuned for updates!</p>`,
    };

    await transporter.sendMail(welcomeMailOptions);

    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }
    res.status(500).json({ message: 'Subscription failed' });
  }
});

// Notify subscribers about a new blog post
router.post('/subscribe/notify', async (req, res) => {
    try {
      const { postTitle, postContent } = req.body;
  
      // Fetch all subscribers
      const subscribers = await Subscriber.find({});
  
      // Send email to each subscriber
      for (const subscriber of subscribers) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: subscriber.email,
          subject: `New Blog Post: ${postTitle}`,
          html: `<h1>${postTitle}</h1>
                 <p>${postContent}</p>
                 <p>Thank you for being a valued subscriber!</p>`,
        };
  
        await transporter.sendMail(mailOptions);
      }
  
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
  router.get('/test-email', async (req, res) => { // <-- GET route
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