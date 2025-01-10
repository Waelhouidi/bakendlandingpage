const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, default: 'avatar.png' },
    date: { type: Date, default: Date.now }, 
    userShared: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, 
    publishedAt: { type: Date, default: null }, 
});

module.exports = mongoose.model('Post', postSchema);
