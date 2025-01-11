const Post = require('../models/publication.model');

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
