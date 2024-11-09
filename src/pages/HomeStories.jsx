import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomeStories = ({ userId }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [likeStatus, setLikeStatus] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:4000/api/profile/details2`,
                {
                    params: { userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.user) {
                setUserDetails(response.data.user);
            } else {
                setError('User details not found');
                toast.error('Error fetching user details');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Error fetching user details. Please try again later.');
            toast.error('Error fetching user details');
        }
    };

    const fetchStories = async () => {
        try {
            const token = localStorage.getItem('token');
            const following = userDetails?.following || [];
            following.push(userId);

            const allStories = [];
            for (const followerId of following) {
                const response = await axios.get(
                    `http://localhost:4000/api/stories/user/${followerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                allStories.push(...response.data.stories);
            }

            setStories(allStories);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || 'Error fetching stories');
            toast.error(error.response?.data?.message || 'Error fetching stories');
        }
    };

    const openModal = async (story) => {
        setSelectedStory(story);
        setIsModalOpen(true);

        // Fetch latest like status from the database
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:4000/api/stories/${story._id}/like-status`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setLikeStatus(response.data.isLiked);
                setLikesCount(response.data.likesCount);
            }
        } catch (error) {
            toast.error('Error fetching like status');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStory(null);
    };

    const handleOutsideClick = (e) => {
        if (e.target.className.includes('modal-overlay')) closeModal();
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days} day(s) ago`;
        if (hours > 0) return `${hours} hour(s) ago`;
        if (minutes > 0) return `${minutes} minute(s) ago`;
        return 'Just now';
    };

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:4000/api/stories/story/like/${selectedStory._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setLikesCount(response.data.likes.length);
                setLikeStatus(true);
                toast.success('Story liked!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error liking story');
        }
    };

    const handleUnlike = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:4000/api/stories/story/unlike/${selectedStory._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setLikesCount(response.data.likes.length);
                setLikeStatus(false);
                toast.success('Story unliked!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error unliking story');
        }
    };

    useEffect(() => {
        if (userId) fetchUserDetails();
    }, [userId]);

    useEffect(() => {
        if (userDetails) fetchStories();
    }, [userDetails]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Stories</h2>
            <div className="max-w-3xl overflow-x-auto flex gap-4 py-2">
                {stories.length > 0 ? (
                    stories.map((story) => (
                        <div
                            key={story._id}
                            className="flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden group cursor-pointer"
                            onClick={() => openModal(story)}
                        >
                            {story.mediaType === 'photo' ? (
                                <img
                                    src={story.media}
                                    alt={`Story by ${story.user.firstName}`}
                                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
                                />
                            ) : (
                                <video
                                    controls
                                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
                                >
                                    <source src={story.media} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {/*<div className="absolute  left-2 text-white bg-black bg-opacity-50 p-1 rounded-md text-xs">
                                {getTimeAgo(story.timestamp)}
                            </div>*/}
                        </div>
                    ))
                ) : (
                    <div className="text-center">No stories available</div>
                )}
            </div>

            {isModalOpen && selectedStory && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 modal-overlay"
                    onClick={handleOutsideClick}
                >
                    <div className="relative bg-white p-6 rounded-lg max-w-lg w-11/12 max-h-3/4 overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 text-2xl"
                        >
                            &times;
                        </button>
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold">
                                {selectedStory.user.firstName} {selectedStory.user.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {getTimeAgo(selectedStory.timestamp)}
                            </p>
                        </div>
                        <div className="flex justify-center items-center mb-4">
                            {selectedStory.mediaType === 'photo' ? (
                                <img
                                    src={selectedStory.media}
                                    alt={`Story by ${selectedStory.user.firstName}`}
                                    className="max-w-full max-h-96 object-contain rounded-xl"
                                />
                            ) : (
                                <video controls className="max-w-full max-h-96 object-contain rounded-xl">
                                    <source src={selectedStory.media} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700">
                                <strong>Posted by:</strong> {selectedStory.user.firstName} {selectedStory.user.lastName}
                            </p>
                            <p className="text-gray-700">
                                <strong>Description:</strong> {selectedStory.description || 'No description available'}
                            </p>
                            <p className="text-gray-700">
                                <strong>Likes:</strong> {likesCount}
                            </p>
                            <button
                                onClick={likeStatus ? handleUnlike : handleLike}
                                className={`px-4 py-2 rounded-md ${likeStatus ? 'bg-pink-500' : 'bg-blue-500'
                                    } text-white mt-2`}
                            >
                                {likeStatus ? 'Unlike' : 'Like'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeStories;
