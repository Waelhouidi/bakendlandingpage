const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, default: 'avatar.png' },
    date: { type: Date, default: Date.now }, 
    userShared: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to User model
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, // Reference to Admin model
    publishedAt: { type: Date, default: null }, // Null if not published yet
});

module.exports = mongoose.model('Post', postSchema);
