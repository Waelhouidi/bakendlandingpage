const Service = require('../models/service.model');

// Create a new service
exports.createService = async (req, res) => {
    const { nameservice, title, desc, Image, Imagesponsor ,tags} = req.body;
    try {
        const service = new Service({ nameservice, title, desc, Image, Imagesponsor,tags });
        const savedService = await service.save();
        res.status(201).json({ message: "Service created successfully", service: savedService });
    } catch (error) {
        res.status(500).json({ message: "Error creating service", error });
    }
};

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error });
    }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service", error });
    }
};

// Update a service
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { nameservice, title, desc, Image, Imagesponsor } = req.body;
    try {
        const service = await Service.findByIdAndUpdate(
            id,
            { nameservice, title, desc, Image, Imagesponsor },
            { new: true }
        );
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.status(200).json({ message: "Service updated successfully", service });
    } catch (error) {
        res.status(500).json({ message: "Error updating service", error });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findByIdAndDelete(id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service", error });
    }
};
