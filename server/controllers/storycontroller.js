const Story = require('../models/Story');
const cloudinary = require('../config/cloudinary');



exports.createStory = async (req, res) => {
    try {
       // console.log("Authenticated User:", req.user); // Debugging line
       console.log(req.file.mimetype);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        let result;
        
        if (req.file.mimetype.startsWith('image/')) {
            result = await cloudinary.uploadImage(req.file.path);
        } else if (req.file.mimetype.startsWith('video/')) {
            result = await cloudinary.uploadVideo(req.file.path);
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid file type. Only images and videos are allowed."
            });
        }
        //console.log("**************");
        //console.log(req.user.id);
        //console.log("-----------------");

        const newStory = new Story({
            user: req.user.id, // Ensure req.user._id is populated
            media: result.secure_url,
            mediaType: req.file.mimetype.startsWith('video') ? 'video' : 'photo',
            text: req.body.text || ''
        });

        await newStory.save();

        res.status(201).json({
            success: true,
            message: "Story uploaded successfully.",
            story: newStory
        });
    } catch (error) {
        console.error("Error creating story:", error); // Detailed error logging
        res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
            error: error.message // Optional: include error message in response
        });
    }
};



exports.likeStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found."
            });
        }

        // Check if user already liked the story
        if (story.likes.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "You have already liked this story."
            });
        }

        story.likes.push(req.user.id);
        await story.save();

        res.status(200).json({
            success: true,
            message: "Story liked successfully.",
            likes: story.likes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
};

exports.unlikeStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found."
            });
        }

        // Check if user has not liked the story
        if (!story.likes.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "You have not liked this story."
            });
        }

        // Remove user from likes array
        story.likes = story.likes.filter(userId => userId.toString() !== req.user.id.toString());
        await story.save();

        res.status(200).json({
            success: true,
            message: "Story unliked successfully.",
            likes: story.likes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
};

exports.deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found."
            });
        }

        // Check if the user is the owner of the story
        if (story.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this story."
            });
        }

        // Optionally, you can delete the media from Cloudinary here if you store the public ID
        await cloudinary.destroyImage(story.media); // Assuming the media field contains the public ID

        await Story.findByIdAndDelete(req.params.storyId);

        res.status(200).json({
            success: true,
            message: "Story deleted successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
};
