const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

router.post('/', serviceController.createService);         
router.get('/getAll', serviceController.getAllServices);          
router.get('/:id', serviceController.getServiceById);      
router.put('/:id', serviceController.updateService);      
router.delete('/:id', serviceController.deleteService);   

module.exports = router;
