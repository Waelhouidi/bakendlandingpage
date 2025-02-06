const Post = require('../models/publication.model');

// Create Comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({ message: 'Text and userId are required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ text, userId });
    await post.save();
    
    // Populate user details in the comment
    await post.populate('comments.userId', 'username email');

    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Comments for a Post
exports.getComments = async (req, res) => {
  console.log('Received request for postId:', req.params.postId); // Add this

  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('comments.userId', 'username email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Comment
exports.updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text, userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verify user ownership
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this comment' });
    }

    comment.text = text;
    await post.save();
    
    await post.populate('comments.userId', 'username email');

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verify user ownership
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};