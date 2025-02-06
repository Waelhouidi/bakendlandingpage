const mongoose = require('mongoose');
const  commentsSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true }, 
            date: { type: Date, default: Date.now } 
        });
        
        module.exports = mongoose.model('Comment', commentsSchema);