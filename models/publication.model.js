const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    userShared: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the post
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who commented
        text: { type: String, required: true }, // Comment text
        date: { type: Date, default: Date.now } // Comment date
    }],
    date: { type: Date, default: Date.now },
    image: { type: String, default: 'avatar.png' },
    imagePublication: { type: String, default: 'wael.png' },
    publishedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Post', postSchema);