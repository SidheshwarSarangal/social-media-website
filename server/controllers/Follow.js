const User = require('../models/User');

// Follow User
exports.followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        if (userId === currentUserId) {
            return res.status(400).json({ success: false, message: "Cannot follow yourself." });
        }

        const userToFollow = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (currentUser.following.includes(userId)) {
            return res.status(400).json({ success: false, message: "You are already following this user." });
        }

        currentUser.following.push(userId);
        userToFollow.followers.push(currentUserId);

        await currentUser.save();
        await userToFollow.save();

        return res.status(200).json({ success: true, message: "User followed successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error following user.", error });
    }
};

// Unfollow User
// Unfollow User
exports.unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        if (userId === currentUserId) {
            return res.status(400).json({ success: false, message: "Cannot unfollow yourself." });
        }

        const userToUnfollow = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!currentUser.following.includes(userId)) {
            return res.status(400).json({ success: false, message: "You are not following this user." });
        }

        currentUser.following.pull(userId);
        userToUnfollow.followers.pull(currentUserId);

        await currentUser.save();
        await userToUnfollow.save();

        return res.status(200).json({ success: true, message: "User unfollowed successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error unfollowing user.", error });
    }
};
