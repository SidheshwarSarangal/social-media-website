const Reel = require('../models/Reel');
const { uploadVideo, destroyVideo } = require('../config/cloudinary');

// Create a new Reel
exports.createReel = async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file; // Assuming multer is used for file uploads
        const { caption } = req.body;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const uploadResult = await uploadVideo(file.path);

        const reel = new Reel({
            user: userId,
            media: uploadResult.secure_url,
            caption,
        });

        await reel.save();
        return res.status(201).json({ success: true, message: 'Reel created successfully.', reel });
    } catch (error) {
        console.error('Error creating reel:', error);
        return res.status(500).json({ success: false, message: 'Error creating reel.', error });
    }
};

// Like a Reel
exports.likeReel = async (req, res) => {
    try {
        const reelId = req.params.reelId;
        const userId = req.user.id;

        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found.' });
        }

        if (reel.likes.includes(userId)) {
            return res.status(400).json({ success: false, message: 'Reel already liked.' });
        }

        reel.likes.push(userId);
        await reel.save();

        return res.status(200).json({ success: true, message: 'Reel liked successfully.', reel });
    } catch (error) {
        console.error('Error liking reel:', error);
        return res.status(500).json({ success: false, message: 'Error liking reel.', error });
    }
};

// Unlike a Reel
exports.unlikeReel = async (req, res) => {
    try {
        const reelId = req.params.reelId;
        const userId = req.user.id;

        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found.' });
        }

        reel.likes = reel.likes.filter((id) => id.toString() !== userId);
        await reel.save();

        return res.status(200).json({ success: true, message: 'Reel unliked successfully.', reel });
    } catch (error) {
        console.error('Error unliking reel:', error);
        return res.status(500).json({ success: false, message: 'Error unliking reel.', error });
    }
};

// Delete a Reel
exports.deleteReel = async (req, res) => {
    try {
        const reelId = req.params.reelId;
        const userId = req.user.id;

        const reel = await Reel.findById(reelId);

        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found.' });
        }


        if (reel.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized.' });
        }


        await destroyVideo(reel.media); // Delete from Cloudinary

        await reel.deleteOne();
      //  console.log("************")


        return res.status(200).json({ success: true, message: 'Reel deleted successfully.' });
    } catch (error) {
        console.error('Error deleting reel:', error);
        return res.status(500).json({ success: false, message: 'Error deleting reel.', error });
    }
};
