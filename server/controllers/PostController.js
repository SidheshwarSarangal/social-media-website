const Post = require('../models/Post');
const mongoose = require('mongoose');

// Create a new post (only logged-in users)
exports.createPost = async (req, res) => {
    try {
        const user = req.user; // Fetching the authenticated user
        const { image, caption } = req.body;

        const newPost = new Post({
            user: user._id, // Use authenticated user's ID
            image,
            caption,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error });
    }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'firstName lastName image')
            .populate('comments.user', 'firstName lastName image')
            .exec();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error });
    }
};

// Update a post (only the post creator can update)
exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { caption } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the logged-in user is the creator of the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        post.caption = caption;
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error });
    }
};

// Delete a post (only the post creator can delete)
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the logged-in user is the creator of the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        await post.remove();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post', error });
    }
};

// Like a post (only logged-in users)
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user._id;

        if (!post.likes.includes(userId)) {
            post.likes.push(userId); // Add the user's ID to the likes array
        } else {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString()); // Unlike
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to like post', error });
    }
};

// Comment on a post (only logged-in users)
exports.commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user._id;

        const newComment = {
            user: userId,
            text,
            date: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to comment on post', error });
    }
};
