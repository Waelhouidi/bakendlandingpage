const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../routes/subscribe.routes');
const nodemailer = require('nodemailer');






// 📌 Configurer le transporteur Nodemailer



// 📌 Inscription d'un utilisateur
exports.register = async (req, res) => {
    const characters = "kjshgchjgcsdncezhbyezbgbjzkhcjgsngxhfnxv5ifu";
    let activationCode = "";
    for (let i = 0; i < 25; i++) {
        activationCode += characters[Math.floor(Math.random() * characters.length)];
    }

    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            activationCode,
            role: role || 'user',
        });

        await newUser.save();

       
        return res.status(201).json({ message: "User created successfully. Check your email to activate your account." });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};






// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user's email is verified
      

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token, including the user's role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "1h" }
        );

        // Store user information in the session (optional)
        if (req.session) {
            req.session.user = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            };
        }

        res.status(200).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit user details
exports.edit = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ message: "User updated successfully", user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(id);

        // Check if the user existed
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout user
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out, please try again" });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: "Logged out successfully" });
    });
};

// Get current user
exports.getCurrentUser = (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ message: "Not logged in" });
    }
};
// Add this to your user.controller.js
// userController.js
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};