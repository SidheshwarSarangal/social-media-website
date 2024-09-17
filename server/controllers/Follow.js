const User = require('../models/User');
const mongoose = require('mongoose');

// Follow a user
exports.followUser = async (req, res) => {
    try {
        // Extract userId from the authenticated session/token (e.g., req.user._id)
        const userId = req.user._id;  // Assuming req.user contains the authenticated user's ID
        const { targetId } = req.body;  // targetId is the ID of the user to follow

        // Validate user IDs
        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(400).json({ message: 'Invalid target user ID' });
        }

        // Check if the target user exists
        const targetUser = await User.findById(targetId);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already following the target user
        const user = await User.findById(userId);
        if (user.following.includes(targetId)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        // Add the target user to the following list of the user and the user to the followers list of the target user
        user.following.push(targetId);
        targetUser.followers.push(userId);

        // Save both users
        await user.save();
        await targetUser.save();

        res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to follow user', error });
    }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    try {
        // Extract userId from the authenticated session/token (e.g., req.user._id)
        const userId = req.user._id;  // Assuming req.user contains the authenticated user's ID
        const { targetId } = req.body;  // targetId is the ID of the user to unfollow

        // Validate user IDs
        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(400).json({ message: 'Invalid target user ID' });
        }

        // Check if the target user exists
        const targetUser = await User.findById(targetId);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is following the target user
        const user = await User.findById(userId);
        if (!user.following.includes(targetId)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        // Remove the target user from the following list of the user and the user from the followers list of the target user
        user.following = user.following.filter((id) => id.toString() !== targetId);
        targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);

        // Save both users
        await user.save();
        await targetUser.save();

        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to unfollow user', error });
    }
};
