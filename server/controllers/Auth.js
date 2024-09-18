const User = require('../models/User');
const Profile = require('../models/Profile');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate');
const passwordUpdated = require('../mail/templates/passwordupdate');


// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newOtp = new OTP({ email, otp });
        await newOtp.save();

        await mailSender(email, "Verification OTP", emailVerificationTemplate(otp));

        return res.status(200).json({ success: true, message: "OTP sent successfully.", otp: otp });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error sending OTP.", error });
    }
};

// Signup


exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, contactNumber, otp } = req.body;

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists.",
            });
        }

        // Validate OTP
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "OTP is not valid.",
            });
        } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile details
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
        });

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Save the user to the database
        await newUser.save();

        // Optionally, you can remove the used OTP from the database if you no longer need it
        await OTP.deleteMany({ email }); // Ensure you handle OTP cleanup as needed

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({
            success: false,
            message: "Error creating user.",
            error: error.message, // Include the error message for more details
        });
    }
};


// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ success: true, message: "Login successful.", token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error logging in.", error });
    }
};

// Change Password

/*
exports.changePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error changing password.", error });
    }
};
*/


exports.changePassword = async (req, res) => {
    try {
        // Get user ID from auth middleware
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        // Find the user by ID (authenticated user)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: "The old password is incorrect." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Optionally, send a notification email
        try {
            const emailResponse = await mailSender(
                user.email,
                "Password for your account has been updated",
                passwordUpdated(
                    user.email,
                    `Password updated successfully for ${user.firstName} ${user.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            console.error("Error occurred while sending email:", error);
            // You can decide whether to continue or return an error response
        }

        return res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error changing password.", error });
    }
};