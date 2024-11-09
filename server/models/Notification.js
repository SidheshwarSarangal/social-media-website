const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User receiving the notification
    action: { type: String, enum: ['follow', 'unfollow'], required: true }, // Action type (follow/unfollow)
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who performed the action
    createdAt: { type: Date, default: Date.now }, // Time when the notification was created
    expiredAt: { type: Date, required: true }, // Expiry time for the notification (24 hours later)
  },
  { timestamps: true }
);

notificationSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 }); // Automatically delete notifications after 24 hours

module.exports = mongoose.model('Notification', notificationSchema);
