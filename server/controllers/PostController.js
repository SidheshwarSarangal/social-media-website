const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { user, image, caption } = req.body;

        // Check if user exists
        const foundUser = await User.findById(user);
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPost = new Post({
            user,
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

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(postId)
            .populate('user', 'firstName lastName image')
            .populate('comments.user', 'firstName lastName image')
            .exec();

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post', error });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { caption } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { caption },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post', error });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid IDs' });
        }

        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!post || !user) {
            return res.status(404).json({ message: 'Post or user not found' });
        }

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter((id) => id.toString() !== userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to like post', error });
    }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId, text } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid IDs' });
        }

        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!post || !user) {
            return res.status(404).json({ message: 'Post or user not found' });
        }

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
