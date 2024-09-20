const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String, required: true }, // URL of the image/video
    mediaType: { type: String, enum: ['photo', 'video'], required: true }, // Field for media type
    text: { type: String, trim: true },
    timestamp: { type: Date, default: Date.now, expires: '24h' }, // Story expires after 24 hours
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Story', storySchema);
