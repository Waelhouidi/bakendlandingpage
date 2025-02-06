const commentsModel = require('../models/comments.model');
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
  
      const newComment = { text, userId, date: new Date() };
      post.comments.push(newComment);
  
      // Save the post with the new comment
      await post.save();
  
      // Populate the comments with user details (e.g., username)
      await post.populate('comments.userId', 'username'); // Only bring back the username
  
      res.status(200).json({ 
        message: 'Comment added successfully', 
        comments: post.comments 
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };