const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 5 }
});

OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        await mailSender(this.email, "Verification Email", emailTemplate(this.otp));
    }
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);
