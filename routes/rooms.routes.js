const express = require('express');
const router = express.Router();
const roomController = require('../controllers/rooms.controller');

// Routes for Room
router.post('/rooms', roomController.createRoom);              // Create a new room
router.get('/rooms', roomController.getAllRooms);              // Get all rooms
router.get('/rooms/:id', roomController.getRoomById);          // Get a single room by ID
router.put('/rooms/:id/reserve', roomController.reserveRoom);  // Reserve a room
router.put('/rooms/:id/release', roomController.releaseRoom);  // Release a reserved room
router.delete('/rooms/:id', roomController.deleteRoom);        // Delete a room

module.exports = router;
