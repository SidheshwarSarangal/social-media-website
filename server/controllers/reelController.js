const Reel = require('../models/Reel');
const { uploadVideo, destroyVideo } = require('../config/cloudinary');

// Create a new Reel





const User = require('../models/User'); // Assuming you have a User model

// Get All Reels
exports.getAllReels = async (req, res) => {
    try {
        const reels = await Reel.find()
            .populate('user', 'firstName lastName image') // Populate user details
            .sort({ timestamp: -1 }); // Sort reels by timestamp in descending order

        return res.status(200).json({ success: true, reels });
    } catch (error) {
        console.error('Error fetching reels:', error);
        return res.status(500).json({ success: false, message: 'Error fetching reels.', error });
    }
};

exports.getReelsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reels = await Reel.find({ user: userId }).populate('user', 'firstName lastName image'); // Populate user details if needed
        res.status(200).json({ reels });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reels' });
    }
};

exports.createReel = async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file; // Assuming multer is used for file uploads
        const { caption } = req.body;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const uploadResult = await uploadVideo(file.path);

        const reel = new Reel({
            user: userId,
            media: uploadResult.secure_url,
            caption,
        });

        await reel.save();
        return res.status(201).json({ success: true, message: 'Reel created successfully.', reel });
    } catch (error) {
        console.error('Error creating reel:', error);
        return res.status(500).json({ success: false, message: 'Error creating reel.', error });
    }
};

// Like a Reel
exports.likeReel = async (req, res) => {
    try {
        const reelId = req.params.reelId;
        const userId = req.user.id;

        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found.' });
        }

        if (reel.likes.includes(userId)) {
            return res.status(400).json({ success: false, message: 'Reel already liked.' });
        }

        reel.likes.push(userId);
        await reel.save();

        return res.status(200).json({ success: true, message: 'Reel liked successfully.', reel });
    } catch (error) {
        console.error('Error liking reel:', error);
        return res.status(500).json({ success: false, message: 'Error liking reel.', error });
    }
};

// Unlike a Reel
exports.unlikeReel = async (req, res) => {
    try {
        const reelId = req.params.reelId;
        const userId = req.user.id;

        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found.' });
        }

        reel.likes = reel.likes.filter((id) => id.toString() !== userId);
        await reel.save();

        return res.status(200).json({ success: true, message: 'Reel unliked successfully.', reel });
    } catch (error) {
        console.error('Error unliking reel:', error);
        return res.status(500).json({ success: false, message: 'Error unliking reel.', error });
    }
};





// Assuming this is in your reelController
exports.checkIfUserLikedReel = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID
        const reelId = req.params.reelId; // Get the reel ID from the request parameters

        const reel = await Reel.findById(reelId); // Fetch the reel

        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found' });
        }

        // Check if the user has already liked the reel
        const hasLiked = reel.likes.some(like => like.equals(userId));

        if (hasLiked) {
            reel.likes.pull(userId); // Remove user ID from likes
        } else {
            reel.likes.push(userId); // Add user ID to likes
        }

        await reel.save(); // Save the updated reel

        // Return the updated like status and count
        res.status(200).json({
            success: true,
            isLikedByUser: !hasLiked,
            likesCount: reel.likes.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/*
exports.checkIfUserLikedReel = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID
        const reelId = req.params.postId; // Get the post ID from the request parameters

        // Fetch the post by ID
        const reel = await Reel.findById(reelId).lean(); // Use lean to get a plain JavaScript object

        if (!reel) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the user has liked the post
        const isLikedByUser = reel.likes.some(like => like.equals(userId));

        res.status(200).json({ success: true, isLikedByUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};*/

// Delete a Reel
exports.deleteReel = async (req, res) => {
    try {
        const reelId = req.params.reelId;
        const userId = req.user.id;

        const reel = await Reel.findById(reelId);

        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found.' });
        }


        if (reel.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized.' });
        }


        await destroyVideo(reel.media); // Delete from Cloudinary

        await reel.deleteOne();
      //  console.log("************")


        return res.status(200).json({ success: true, message: 'Reel deleted successfully.' });
    } catch (error) {
        console.error('Error deleting reel:', error);
        return res.status(500).json({ success: false, message: 'Error deleting reel.', error });
    }
};
