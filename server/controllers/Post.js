const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');

// Create Post
exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.user.id;
        
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new post
        const newPost = new Post({
            user: userId,
            image: result.secure_url,
            caption,
        });

        await newPost.save();
        return res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating post.", error });
    }
};

// Get All Posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "firstName lastName");
        return res.status(200).json({ success: true, posts });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching posts.", error });
    }
};

// Update Post
exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { caption } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        if (post.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to update this post." });
        }

        post.caption = caption || post.caption;
        await post.save();

        return res.status(200).json({ success: true, message: "Post updated successfully.", post });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating post.", error });
    }
};

// Delete Post
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        if (post.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this post." });
        }

        await post.remove();
        return res.status(200).json({ success: true, message: "Post deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting post.", error });
    }
};

// Like Post
exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        return res.status(200).json({ success: true, message: "Post liked/unliked successfully.", post });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error liking post.", error });
    }
};

// Comment on Post
exports.commentOnPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        post.comments.push({ user: userId, text });
        await post.save();

        return res.status(201).json({ success: true, message: "Comment added successfully.", post });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error commenting on post.", error });
    }
};
