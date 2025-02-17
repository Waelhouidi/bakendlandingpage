const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Subscribe route
router.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Save to database
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Subscription Confirmation',
      html: `<h1>Thank you for subscribing!</h1>
             <p>You've successfully subscribed to our blog.</p>`
    };

    await transporter.sendMail(mailOptions);
    
    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }
    res.status(500).json({ message: 'Subscription failed' });
  }
});

module.exports = router;