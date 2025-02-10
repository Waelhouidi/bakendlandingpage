const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const verifyRole = require('../models/Middleware/auth');
const session=require('../models/Middleware/session')
const pagination = require('../models/Middleware/pagination');
const { validateSession } = require('../models/Middleware/session');

const multer = require('multer');
const myStorage =multer.diskStorage({
    destination:'../public',
    filename : (req,file,cb) =>{
        let fileName= Date.now()+'.'+file.mimetype.split('/')[1];
        req.body.image=fileName;
        cb(null,fileName);
    }

})


router.get('/getall',
    validateSession, // Add this first
    userController.getAllUsers
);
//midllerwaire 
const upload =multer({storage:myStorage});  
// User routes
router.post('/register', userController.register);
router.post('/login',userController.login);
router.post('/logout',userController.logout);
router.get('/user/:id', session.isAuthenticated,userController.getUserById);
router.delete('/user/:id',verifyRole('admin'), userController.deleteUser);
router.put('/user/:id',upload.single('image'), userController.edit);


module.exports = router;
