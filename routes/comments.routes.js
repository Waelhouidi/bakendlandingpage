const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments.controller');

// POST /posts/:postId/comments - Create comment
router.post('/posts/:postId/comments', commentController.addComment);

// GET /posts/:postId/comments - Get all comments for post
router.get('/posts/:postId/comments', commentController.getComments);

// PUT /posts/:postId/comments/:commentId - Update comment
router.put('/posts/:postId/comments/:commentId', commentController.updateComment);

// DELETE /posts/:postId/comments/:commentId - Delete comment
router.delete('/posts/:postId/comments/:commentId', commentController.deleteComment);

module.exports = router;