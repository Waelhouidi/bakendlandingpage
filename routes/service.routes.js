const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

// Routes for Services
router.post('/services', serviceController.createService);          // Create a new service
router.get('/services', serviceController.getAllServices);          // Get all services
router.get('/services/:id', serviceController.getServiceById);      // Get a single service by ID
router.put('/services/:id', serviceController.updateService);       // Update a service
router.delete('/services/:id', serviceController.deleteService);    // Delete a service

module.exports = router;
