const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    additionalDetails: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    image: { type: String, required: true },
    contactNumber: { type: Number, trim: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    resetPasswordExpires: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
