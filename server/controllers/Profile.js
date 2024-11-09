const User = require('../models/User');
const cloudinary = require('../config/cloudinary'); // Adjust path if needed
const fs = require('fs');
const Profile = require('../models/Profile');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, contactNumber, gender, dateOfBirth, about } = req.body;

        // Find the user by ID
        const user = await User.findById(userId).populate('additionalDetails');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Update User fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.contactNumber = contactNumber || user.contactNumber;

        // Update Profile fields
        const profile = await Profile.findById(user.additionalDetails);
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found." });
        }

        profile.gender = gender || profile.gender;
        profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
        profile.about = about || profile.about;

        // Save both documents
        await user.save();
        await profile.save();

        return res.status(200).json({ success: true, message: "Profile updated successfully.", user, profile });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating profile.", error });
    }
};


// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user by ID and populate the additionalDetails field to get the profile ID
        const user = await User.findById(userId).populate('additionalDetails');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Find the associated profile and delete it
        const profileId = user.additionalDetails;
        if (profileId) {
            await Profile.findByIdAndDelete(profileId);
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ success: true, message: "Account and profile deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting account and profile.", error });
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
        return res.status(200).json({ success: true, userId, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching user details.", error });
    }
};


exports.getUserDetails2 = async (req, res) => {
    try {
        const userId = req.query.userId; // Extract userId from query parameters
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
        const { file } = req; // File from multer

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }
        

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Delete old image from Cloudinary if it's not the default image
        if (user.image && !user.image.startsWith('https://api.dicebear.com')) {
            const publicId = user.image.split('/').pop().split('.')[0];
            await cloudinary.destroyImage(publicId);
        }
        

        // Upload new image to Cloudinary
        const result = await cloudinary.uploadImage(file.path);

        // Update user image
        user.image = result.secure_url;
        await user.save();
       // console.log("*****************")

        // Optionally, delete local file
        try{
        fs.unlinkSync(file.path);
        }
        catch(error){
            //console.log(error);
        }

        return res.status(200).json({ success: true, message: "Display picture updated successfully.", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating display picture.", error });
    }
};