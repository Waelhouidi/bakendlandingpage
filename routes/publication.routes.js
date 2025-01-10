const express = require('express');
const router = express.Router();
const postController = require('../controllers/publication.controller');

// Routes for Post
router.post('/posts', postController.createPost);          // Create a new post
router.get('/posts', postController.getAllPosts);          // Get all posts
router.get('/posts/:id', postController.getPostById);      // Get a single post by ID
router.put('/posts/:id', postController.updatePost);       // Update a post
router.delete('/posts/:id', postController.deletePost);    // Delete a post

module.exports = router;
