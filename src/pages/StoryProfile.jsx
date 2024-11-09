import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const StoryProfile = ({ userId }) => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStory, setSelectedStory] = useState(null); // For larger view
    const modalRef = useRef(); // Reference for the modal

    const fetchStories = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            const response = await axios.get(`http://localhost:4000/api/stories/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStories(response.data.stories);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || 'Error fetching stories');
            toast.error(error.response?.data?.message || 'Error fetching stories');
        }
    };

    useEffect(() => {
        fetchStories();
    }, [userId]);

    const handleStoryClick = (story) => {
        setSelectedStory(story);
    };

    const handleClose = () => {
        setSelectedStory(null);
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleClose();
        }
    };

    useEffect(() => {
        if (selectedStory) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [selectedStory]);

    if (loading) return <div className="text-center text-gray-500 py-8">Loading stories...</div>;
    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map(story => (
                    <div
                        key={story._id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => handleStoryClick(story)}
                    >
                        {/* Show video player tile if media type is video, otherwise show image tile */}
                        {story.mediaType === 'video' ? (
                            <div className="w-full h-56 bg-black">
                                <video className="w-full h-full object-cover" muted>
                                    <source src={story.media} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <img
                                className="w-full h-56 object-cover"
                                src={story.media}
                                alt={story.text || 'Story'}
                            />
                        )}

                        <div className="p-4">
                            <p className="text-lg font-semibold text-gray-800 truncate">{story.text}</p>
                            <div className="flex items-center justify-between mt-2 text-gray-500 text-sm">
                                <span>{story.likes.length} Likes</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for selected story */}
            {selectedStory && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg p-6 w-full max-w-2xl transform transition-all duration-300"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-red-600 transition-colors"
                        >
                            ✖
                        </button>
                        {/* Modal content based on mediaType */}
                        {selectedStory.mediaType === 'video' ? (
                            <video controls className="w-full rounded-lg mt-4 shadow-lg">
                                <source src={selectedStory.media} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={selectedStory.media}
                                alt={selectedStory.text}
                                className="w-full rounded-lg mt-4 shadow-lg"
                            />
                        )}
                        <div className="mt-4 text-center">
                            <p className="text-xl font-semibold text-gray-800">{selectedStory.text}</p>
                            <span className="block text-gray-500 mt-1">{selectedStory.likes.length} Likes</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryProfile;
