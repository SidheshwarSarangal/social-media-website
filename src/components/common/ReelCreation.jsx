import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { endpoints } from '../../services/apis';

const { CREATE_REEL_API } = endpoints; // Adjust the API endpoint for creating a reel

const ReelCreation = ({ onBack }) => {
    const [caption, setCaption] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Generate a preview of the video
        if (file) {
            const filePreview = URL.createObjectURL(file);
            setPreview(filePreview);
        }
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Please select a video to upload.'); // Change message for video upload
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('file', selectedFile);

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(CREATE_REEL_API, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            toast.success('Reel created successfully!');
            setCaption('');
            setSelectedFile(null);
            setPreview(null);
        } catch (error) {
            console.error("Failed to create reel:", error);
            toast.error('Failed to create reel.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white text-black p-6 rounded-lg w-[550px] h-[550px] relative flex flex-col justify-center items-center shadow-xl transition-transform duration-300 ease-in-out">
            {/* Back Button */}
            <button onClick={onBack} className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none">
                <span className="text-xl text-gray-600 hover:text-red-600">&larr;</span>
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">Create a Reel</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col items-center space-y-4 w-full">
                
                {/* Video Preview */}
                {preview && (
                    <div className="w-full h-48 mb-4 flex justify-center items-center">
                        <video
                            src={preview}
                            controls
                            className="object-cover rounded-md shadow-md max-h-full max-w-full"
                        />
                    </div>
                )}

                {/* Video Upload or Remove Button */}
                <div className="w-full flex justify-center mb-4">
                    {selectedFile ? (
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="block text-sm font-semibold py-2 px-4 rounded-md bg-pink-500 text-white hover:bg-pink-600"
                        >
                            Remove File
                        </button>
                    ) : (
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="video/*" // Accept video files
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
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Posting...' : 'Create Reel'}
                </button>
            </form>
        </div>
    );
};

export default ReelCreation;
