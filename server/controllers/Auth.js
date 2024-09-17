const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");

exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Convert email to lowercase
        const lowerCaseEmail = email.toLowerCase();

        // Check if user is already registered
        const checkUserPresent = await User.findOne({ email: lowerCaseEmail });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already registered'
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated:", otp);

        // Ensure OTP is unique
        let result = await OTP.findOne({ otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        }

        // Save OTP to database
        const otpPayload = { email: lowerCaseEmail, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body:", otpBody);

        // Send OTP via email
        // Uncomment and use mailSender if needed
        // await mailSender(lowerCaseEmail, "Your OTP", otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp, // Note: In production, you should not return OTP in response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            contactNumber,
            otp,
        } = req.body;

        // Convert email to lowercase
        const lowerCaseEmail = email.toLowerCase();

        // Check if all required fields are provided
        if (!firstName || !lastName || !lowerCaseEmail || !password || !confirmPassword || !otp || !contactNumber) {
            return res.status(403).send({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match. Please try again.",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: lowerCaseEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        // Find the most recent OTP for the email
        const response = await OTP.find({ email: lowerCaseEmail }).sort({ createdAt: -1 }).limit(1);
        console.log("OTP Response: ", response);

        if (response.length === 0) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        // Ensure both OTPs are treated as strings and trimmed of whitespace
        const userOtp = otp.toString().trim();
        const dbOtp = response[0].otp.toString().trim();

        if (userOtp !== dbOtp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user profile
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
        });

        // Create the new user
        const user = await User.create({
            firstName,
            lastName,
            email: lowerCaseEmail,
            contactNumber,
            password: hashedPassword,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Convert email to lowercase
        const lowerCaseEmail = email.toLowerCase();

        const user = await User.findOne({ email: lowerCaseEmail }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, sign up first",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Fix expiry time
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'Logged in successfully',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failure, please try again',
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id);
        const { oldPassword, newPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "The password is incorrect"
            });
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        // Send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};
