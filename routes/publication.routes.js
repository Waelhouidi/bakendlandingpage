const express = require('express');
const router = express.Router();
const postController = require('../controllers/publication.controller');
const upload = require('../models/Middleware/upload');

// Define the routes for publication-related operations
router.get('/getposts', postController.getAllPosts);        
router.get('/:id', postController.getPostById);      
router.put('/:id', postController.updatePost);       
router.delete('/:id', postController.deletePost);    
router.post('/toggleLike', postController.toggleLike);
router.post('/:postId/addComment', postController.addComment);
router.post('/create', upload.single('imagePublication'), postController.createPost); // Route for creating post with file upload
// In your route handler
router.post('/createPost',
    upload.fields([
      { name: 'imagePublication', maxCount: 1 },
      { name: 'imagesArray', maxCount: 5 }
    ]),
    (req, res, next) => {
      console.log('Uploaded Files:', req.files); // Check fields here
      next();
    },
    postController.createPost
  );
  
  
module.exports = router;
