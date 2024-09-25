const cloudinary = require('cloudinary').v2;

exports.uploadImage = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: process.env.FOLDER_NAME,
        });
        return result;
    } catch (error) {
        console.error("Error uploading image", error);
    }
};
