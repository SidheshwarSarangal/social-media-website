const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String, required: true }, // URL of the video
    caption: { type: String, trim: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reel', reelSchema);
