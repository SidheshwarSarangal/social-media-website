const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const passwordUpdateTemplate = require('../mail/templates/passwordupdate');

// Generate Reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.resetPasswordToken = resetToken;
        await user.save();

        // Send email
        const resetLink = `http://localhost:4000/reset-password/${resetToken}`;
        await mailSender(email, "Password Reset Request", `Click on this link to reset your password: ${resetLink}`);

        return res.status(200).json({ success: true, message: "Reset password link sent." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error generating reset token.", error });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find the user by reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Token is invalid or has expired." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send confirmation email
        await mailSender(user.email, "Password Updated", passwordUpdateTemplate());

        return res.status(200).json({ success: true, message: "Password has been updated successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error resetting password.", error });
    }
};
