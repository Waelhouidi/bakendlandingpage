const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

// Routes for Services
router.post('/', serviceController.createService);          // Create a new service
router.get('/', serviceController.getAllServices);          // Get all services
router.get('/:id', serviceController.getServiceById);      // Get a single service by ID
router.put('/:id', serviceController.updateService);       // Update a service
router.delete('/:id', serviceController.deleteService);    // Delete a service

module.exports = router;
