const Room = require('../models/rooms.model');
const User = require('../models/user.model');

// Create a new room
exports.createRoom = async (req, res) => {
    const { roomNumber } = req.body;
    try {
        const room = new Room({ roomNumber });
        const savedRoom = await room.save();
        res.status(201).json({ message: "Room created successfully", room: savedRoom });
    } catch (error) {
        res.status(500).json({ message: "Error creating room", error });
    }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('reservedBy');
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rooms", error });
    }
};

// Get a single room by ID
exports.getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findById(id).populate('reservedBy');
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Error fetching room", error });
    }
};

// Reserve a room
exports.reserveRoom = async (req, res) => {
    const { id } = req.params;
    const { userId, reservationReason } = req.body;
    try {
        const room = await Room.findById(id);
        if (!room) return res.status(404).json({ message: "Room not found" });
        if (!room.isAvailable) return res.status(400).json({ message: "Room is already reserved" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        room.isAvailable = false;
        room.reservedBy = user._id;
        room.reservationReason = reservationReason;

        const updatedRoom = await room.save();
        res.status(200).json({ message: "Room reserved successfully", room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: "Error reserving room", error });
    }
};

// Release a room
exports.releaseRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findById(id);
        if (!room) return res.status(404).json({ message: "Room not found" });

        room.isAvailable = true;
        room.reservedBy = null;
        room.reservationReason = '';

        const updatedRoom = await room.save();
        res.status(200).json({ message: "Room released successfully", room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: "Error releasing room", error });
    }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting room", error });
    }
};
