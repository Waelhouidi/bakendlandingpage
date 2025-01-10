const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const multer = require('multer');
const myStorage =multer.diskStorage({
    destination:'../public',
    filename : (req,file,cb) =>{
        let fileName= Date.now()+'.'+file.mimetype.split('/')[1];
        req.body.image=fileName;
        cb(null,fileName);
    }

})
//midllerwaire 
const upload =multer({storage:myStorage});  
// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user/:id', userController.getUserById);
router.put('/user/:id',upload.single('image'), userController.edit);

module.exports = router;
