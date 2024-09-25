// cloudinary.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
        console.log("Cloudinary connected successfully");
    } catch (error) {
        console.error("Cloudinary configuration error:", error.message);
    }
};

exports.uploadImage = async (filePath) => {
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(filePath);
        // Optionally, delete local file after upload
        fs.unlinkSync(filePath);
        return result;
    } catch (error) {
        throw new Error(`Error uploading image: ${error.message}`);
    }
};

exports.destroyImage = async (publicId) => {
    try {
        // Delete image from Cloudinary
        //const result = 
        await cloudinary.uploader.destroy(publicId);
       // return result;
    } catch (error) {
        throw new Error(`Error deleting image: ${error.message}`);
    }
};

exports.uploadVideo = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "video",
            duration: 60, // Automatically trim videos to a max of 60 seconds
        });
        fs.unlinkSync(filePath);
        return result;
    } catch (error) {
        throw new Error(`Error uploading video: ${error.message}`);
    }
};

exports.destroyVideo = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
        });
    } catch (error) {
        throw new Error(`Error deleting video: ${error.message}`);
    }
};