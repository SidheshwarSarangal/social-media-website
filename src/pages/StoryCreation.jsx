import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CREATE_STORY_API = "http://localhost:4000/api/stories/story";

const StoryCreation = ({ onBack }) => {
    const [caption, setCaption] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file); // Set the selected file

        // Check if the file is an image or video and generate a preview accordingly
        if (file) {
            const filePreview = URL.createObjectURL(file);
            setPreview(filePreview);
        }
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value); // Get the caption input
    };

    const handleRemoveFile = () => {
        setSelectedFile(null); // Clear the selected file
        setPreview(null); // Remove the preview
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }

        setIsSubmitting(true);

        // Create a new FormData instance
        const formData = new FormData();
        formData.append('text', caption);
        formData.append('file', selectedFile);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(CREATE_STORY_API, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success('Story created successfully!'); // Success message
            setCaption('');
            setSelectedFile(null);
            setPreview(null);
        } catch (error) {
            console.error("Failed to create story:", error); // Log any errors
            toast.error('Failed to create story.'); // Error message
        } finally {
            // Re-enable the button after request completes
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white text-black p-6 rounded-lg w-[550px] h-[550px] relative flex flex-col justify-center items-center shadow-xl transition-transform duration-300 ease-in-out">
            {/* Back Button */}
            <h2 className="text-xl font-semibold mb-4 text-center">Create a Story</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col items-center space-y-4 w-full">
                
                {/* File Preview - Image or Video */}
                {preview && (
                    <div className="w-full h-48 mb-4 flex justify-center items-center">
                        {/* Check if the file is a video or image */}
                        {selectedFile && selectedFile.type.startsWith('video') ? (
                            <video controls className="w-full h-full object-cover rounded-md shadow-md max-h-full max-w-full">
                                <source src={preview} type={selectedFile.type} />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={preview}
                                alt="Selected"
                                className="object-cover rounded-md shadow-md max-h-full max-w-full"
                            />
                        )}
                    </div>
                )}

                {/* Image Upload or Remove Button */}
                <div className="w-full flex justify-center mb-4">
                    {selectedFile ? (
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className={`block text-sm font-semibold py-2 px-4 rounded-md ${isSubmitting ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'} text-white`}
                            disabled={isSubmitting} // Disable Remove File button while submitting
                        >
                            Remove File
                        </button>
                    ) : (
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*, video/*" // Allow both images and videos
                            className="block text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-500 file:text-white
                            hover:file:bg-blue-600"
                            required
                        />
                    )}
                </div>

                {/* Caption Input */}
                <div className="w-full">
                    <textarea
                        value={caption}
                        onChange={handleCaptionChange}
                        className="block w-full p-2 text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none outline-none"
                        placeholder="Write a caption..."
                        rows="4"
                        style={{ border: 'none', backgroundColor: '#f0f0f0' }}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full px-4 py-2 text-white rounded-md ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    disabled={isSubmitting} // Disable the button while submitting
                >
                    {isSubmitting ? 'Posting...' : 'Create Story'}
                </button>
            </form>
        </div>
    );
};

export default StoryCreation;
