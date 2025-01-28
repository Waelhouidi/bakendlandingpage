const express = require('express');
const router = express.Router();
const postController = require('../controllers/publication.controller');

router.post('/create', postController.createPost);          
router.get('/getposts', postController.getAllPosts);        
router.get('/:id', postController.getPostById);      
router.put('/:id', postController.updatePost);       
router.delete('/:id', postController.deletePost);    
router.post('/toggleLike', postController.toggleLike);
router.post('/:postId/addComment', postController.addComment);
module.exports = router;
