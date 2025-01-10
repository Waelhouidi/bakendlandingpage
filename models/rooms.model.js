const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
    reservationReason: { type: String, default: '' },
});