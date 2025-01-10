const express = require('express');
const router = express.Router();
const roomController = require('../controllers/rooms.controller');

router.post('/', roomController.createRoom);              
router.get('/', roomController.getAllRooms);              
router.get('/:id', roomController.getRoomById);           
router.put('/:id/reserve', roomController.reserveRoom);   
router.put('/:id/release', roomController.releaseRoom);   
router.delete('/:id', roomController.deleteRoom);         
module.exports = router;
