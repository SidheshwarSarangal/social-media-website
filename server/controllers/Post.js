const Post = require('../models/Post');
const { uploadImage, destroyImage } = require('../config/cloudinary');  // Correct import
const { validationResult } = require('express-validator');
const fs = require('fs');

// Create Post
exports.createPost = async (req, res) => {
    try {
        // Validate request input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { caption } = req.body;
        const userId = req.user.id;

        // Validate if image exists
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required." });
        }

        // Upload image to Cloudinary
        console.log("-----------------------------------------")
        console.log(req.file.path);

        const result = await uploadImage(req.file.path);  // Use await here

        // Create a new post
        const newPost = new Post({
            user: userId,
            image: result.secure_url,
            caption,
        });

        await newPost.save();
        return res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);  // Log error for debugging
        return res.status(500).json({ success: false, message: "Error creating post.", error: error.message });
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

exports.getUserPosts = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch posts only created by the specific user
        const posts = await Post.find({ user: userId })
            .populate("user", "firstName lastName")  // Populate with user info
            .populate("comments.user", "firstName lastName")  // Populate commenter info
            .sort({ date: -1 });  // Optional: Sort by most recent posts

        // Return posts if found, otherwise an empty array
        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
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

        // If new image is uploaded, update it
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            post.image = result.secure_url;
            fs.unlinkSync(req.file.path); // Optionally delete local file
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

        // Delete image from Cloudinary
        if (post.image_public_id) {
            await destroyImage(post.image_public_id);
        }
       // console.log(post);

        //await post.remove();
        await Post.deleteOne({ _id: postId });
       // console.log("-----------------");

        return res.status(200).json({ success: true, message: "Post deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting post.", error });
    }
};

// Like/Unlike Post

exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        // Check if the user has already liked the post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ success: false, message: "Post already liked." });
        }

        // Add user to likes array
        post.likes.push(userId);
        await post.save();

        return res.status(200).json({ success: true, message: "Post liked successfully.", post });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error liking post.", error });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        console.log("66666666666666666666666")

        if (!post) {
            console.log("66666666666666666666666")

            return res.status(404).json({ success: false, message: "Post not found." });
        }

        // Check if the user has liked the post
        if (!post.likes.includes(userId)) {
            return res.status(400).json({ success: false, message: "Post not liked yet." });
        }

        // Remove user from likes array
        post.likes.pull(userId);
        await post.save();

        return res.status(200).json({ success: true, message: "Post unliked successfully.", post });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error unliking post.", error });
    }
};


exports.commentOnPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        // Add comment to post
        post.comments.push({ user: userId, text, date: Date.now() });
        await post.save();

        return res.status(201).json({ success: true, message: "Comment added successfully.", post });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error commenting on post.", error });
    }
};

// Comment retrieval function in your controller
exports.getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate('comments.user', 'firstName lastName image'); // Populate user's first name, last name, and image in comments
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        return res.status(200).json({ success: true, comments: post.comments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching comments.", error });
    }
};
/*
exports.getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate('comments.user', 'name image'); // Populate user details in comments
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        return res.status(200).json({ success: true, comments: post.comments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching comments.", error });
    }
};
*/



// Controller to delete a comment on a post
exports.deleteCommentOnPost = async (req, res) => {
    try {
        const { postId, commentId } = req.params; // Extract postId and commentId from the request params
        const userId = req.user.id; // The logged-in user's ID

        // Find the post by postId
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        // Find the comment within the post's comments array
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found." });
        }

        // Ensure that the logged-in user is the owner of the comment
        if (comment.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this comment." });
        }

        // Remove the comment from the comments array
        post.comments.pull(commentId);// Mongoose method to remove subdocument

        // Save the post after removing the comment
        await post.save();

        return res.status(200).json({ success: true, message: "Comment deleted successfully.", post });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting comment.", error: error.message });
    }
};


//const Post = require('../models/Post');

// Controller to get all posts with user like status
exports.checkIfUserLikedPost = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID
        const postId = req.params.postId; // Get the post ID from the request parameters

        // Fetch the post by ID
        const post = await Post.findById(postId).lean(); // Use lean to get a plain JavaScript object

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the user has liked the post
        const isLikedByUser = post.likes.some(like => like.equals(userId));

        res.status(200).json({ success: true, isLikedByUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

