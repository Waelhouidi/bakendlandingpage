const express = require('express');
const router = express.Router();
const  catagory = require('../controllers/catagory.controller');


router.post('/createCatagory',catagory.createCategory);
router.post('/deleteCatagory',catagory.deleteCategory);
router.get('/getAllCatagory',catagory.getCategories);
module.exports = router;
