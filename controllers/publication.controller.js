const Post = require('../models/publication.model');
const admin=require('../models/admin.model');
const Category = require('../models/catagory.model'); // Ensure you import Category if needed

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new post
exports.createPost = async (req, res) => {
  try {
      const { title, desc, content, categoryId } = req.body;

      if (!title || !desc || !content || !categoryId) {
          return res.status(400).json({ message: 'All fields are required.' });
      }

      // Check if category exists
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
          return res.status(400).json({ message: 'Invalid category ID.' });
      }

      // Handle image upload
      const imagePublication = req.file ? req.file.filename : null;

      const post = new Post({
          title,
          desc,
          content,
          category: categoryId,  // Set category
          imagePublication: imagePublication ? `uploads/${imagePublication}` : null,
      });

      await post.save();
      res.status(201).json({ message: 'Post created successfully', post });

  } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};





// Get all posts
exports.getAllPosts = async (req, res) => {
    try { 
        const posts = await Post.find().populate('author').populate('userShared').populate('category'); ;
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
  const { title, desc, content, categoryId } = req.body;

  try {
      if (categoryId) {
          const categoryExists = await Category.findById(categoryId);
          if (!categoryExists) {
              return res.status(400).json({ message: 'Invalid category ID.' });
          }
      }

      const updatedPost = await Post.findByIdAndUpdate(
          id,
          { title, desc, content, category: categoryId },
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
