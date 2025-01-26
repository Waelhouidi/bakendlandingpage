const Post = require('../models/publication.model');
const admin=require('../models/admin.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new post
exports.createPost = async (req, res) => {
    const { title, desc, content, author, userShared } = req.body;
    try {
        const post = new Post({
            title,
            desc,
            content,
            author,
            userShared,
        });
        const savedPost = await post.save();
        res.status(201).json({ message: "Post created successfully", post: savedPost });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
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
    try {
      const { postId, userId } = req.body;
  
      if (!ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
  
      const post = await Post.findById(postId);
  
      if (!post) {
        console.log("Post not found:", postId);
        return res.status(404).json({ message: "Post not found" });
      }
  
      const userIndex = post.likes.indexOf(userId);
  
      if (userIndex === -1) {
        post.likes.push(userId);
      } else {
        post.likes.splice(userIndex, 1);
      }
  
      await post.save();
      console.log("Like toggled successfully:", post);
      res.status(200).json({ message: "Like toggled successfully", post });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Error toggling like", error: error.message });
    }
  };
  
  // Add a comment to a post
  exports.addComment = async (req, res) => {
    const { postId, userId, text } = req.body;
  
    console.log("Received request to add comment:", { postId, userId, text });
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        console.log("Post not found:", postId);
        return res.status(404).json({ message: "Post not found" });
      }
  
      console.log("Post found:", post);
  
      // Add the new comment
      const newComment = {
        user: userId,
        text: text,
      };
  
      post.comments.push(newComment);
      await post.save();
      console.log("Comment added successfully:", newComment);
      res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Error adding comment", error: error.message });
    }
  };
  
  
;
