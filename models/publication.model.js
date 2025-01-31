const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
    userShared: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true }, 
        date: { type: Date, default: Date.now } 
    }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
    date: { type: Date, default: Date.now },
    image: { type: String, default: '../public/avatar.png' },
    imagePublication: { type: String, default: "../public/avatar.png" },
    publishedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Post', postSchema);
