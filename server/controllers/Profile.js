const User = require('../models/User');

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, contactNumber } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.contactNumber = contactNumber || user.contactNumber;

        await user.save();

        return res.status(200).json({ success: true, message: "Profile updated successfully.", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating profile.", error });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        await user.remove();
        return res.status(200).json({ success: true, message: "Account deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting account.", error });
    }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('additionalDetails');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching user details.", error });
    }
};

// Update Display Picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const { imageUrl } = req.body; // Assuming the image URL is sent in the request body

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.image = imageUrl || user.image;
        await user.save();

        return res.status(200).json({ success: true, message: "Display picture updated successfully.", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating display picture.", error });
    }
};
