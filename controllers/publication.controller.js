const Post = require('../models/publication.model');
const admin=require('../models/admin.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new post
exports.createPost = async (req, res) => {
  try {

      // Ensure all required fields are provided
      const { title, desc, content, author } = req.body;
      if (!title || !desc || !content || !author) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Handle file upload for image
      const imagePublication = req.file ? req.file.filename : null;

      // Create a new post document
      const post = new Post({
          title,
          desc,
          content,
          author,
          imagePublication: imagePublication ? `uploads/${imagePublication}` : null,
      });

      // Save the post to the database
      await post.save();

      // Return the response
      res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
      console.error("Error creating post:", error);  // Log the error
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};




// Get all posts
exports.getAllPosts = async (req, res) => {
    try { 
        const posts = await Post.find().populate('author').populate('userShared');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error); // Logs the error to the console

        res.status(500).json({ message: "Error fetching posts", error });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).populate('author').populate('userShared');
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post", error });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, desc, content, userShared } = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, desc, content, userShared },
            { new: true }
        );
        if (!updatedPost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: "Error updating post", error });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error });
    }
};

exports.toggleLike = async (req, res) => {
  const { postId, userId } = req.body;

  // Ensure postId and userId are provided and valid ObjectIDs
  if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid postId or userId format" });
  }

  try {
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user already liked the post
    const hasLiked = post.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      // If user already liked, remove their ID from the likes array
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // If user hasn't liked, add their ID to the likes array
      post.likes.push(new ObjectId(userId));
    }

    // Save the updated post
    const updatedPost = await post.save();

    res.status(200).json({
      message: hasLiked ? "Like removed successfully" : "Post liked successfully",
      post: {
        ...updatedPost.toObject(),
        likes: updatedPost.likes.map((id) => id.toString()), // Convert ObjectIDs to strings
      },
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};


  
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

    await post.save();
    res.status(200).json({ message: 'Comment added successfully', comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



  
;
