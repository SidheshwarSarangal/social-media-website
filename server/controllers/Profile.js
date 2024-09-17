const Profile = require("../models/Profile");
const User = require("../models/User");

// Update profile for the logged-in user
exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", about = "", gender = "" } = req.body;
        const userId = req.user._id; // Logged-in user ID from the authentication middleware

        // Validate required fields
        if (!gender) {
            return res.status(400).json({
                success: false,
                message: 'Gender is required',
            });
        }

        // Find the logged-in user's details
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Find the user's profile based on the additionalDetails field
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
        }

        // Update profile fields
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;

        await profileDetails.save(); // Save the updated profile

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profileDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// Delete account for the logged-in user
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id; // Logged-in user ID from the authentication middleware

        // Find the logged-in user's details
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Delete the user's profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);
        // Delete the user's account
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: 'User account deleted successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete user account',
        });
    }
};

// Get details of the logged-in user
exports.getAllUserDetails = async (req, res) => {
    try {
        const userId = req.user._id; // Logged-in user ID from the authentication middleware

        // Find the logged-in user's details and populate profile information
        const userDetails = await User.findById(userId).populate("additionalDetails").exec();
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User details fetched successfully',
            userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
