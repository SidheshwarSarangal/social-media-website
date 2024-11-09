/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LeftSidebar from "../components/common/LeftSidebar";
import toast from 'react-hot-toast';
import StoryCreation from './StoryCreation';
import ProfilePosts from './ProfilePosts';
import ReelProfile from './ReelProfile';
import StoryProfile from './StoryProfile';

const Profile = () => {
    const { userId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [storyModalOpen, setStoryModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('posts');
    const [tokenUserId, setTokenUserId] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const fetchIdFromToken = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/profile/details', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setTokenUserId(response.data.userId);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProfileData = async (userId) => {
        try {
            const response = await axios.get('http://localhost:4000/api/profile/details2', {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProfileData(response.data.user);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || 'Error fetching profile');
            toast.error(error.response?.data?.message || 'Error fetching profile');
        }
    };

    const handleFollowUnfollow = async () => {
        try {
            const endpoint = isFollowing ? `unfollow/${userId}` : `follow/${userId}`;
            const method = isFollowing ? 'delete' : 'post';

            await axios({
                method: method,
                url: `http://localhost:4000/api/auth/${endpoint}`,
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsFollowing(!isFollowing);  // Toggle the following status
            toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
            fetchProfileData(userId);
        } catch (error) {
            toast.error('Action failed');
        }
    };

    useEffect(() => {
        if (userId) {
            fetchProfileData(userId);
        }
    }, [userId, isFollowing]);

    useEffect(() => {
        if (token) {
            fetchIdFromToken(token);
        }
    }, []);

    // Sync `isFollowing` state whenever `profileData` or `tokenUserId` changes
    useEffect(() => {
        if (profileData && tokenUserId) {
            setIsFollowing(profileData.followers.includes(tokenUserId));
        }
    }, [profileData, tokenUserId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const closeModal = () => setModalOpen(false);
    const closeStoryModal = () => setStoryModalOpen(false);

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
            setStoryModalOpen(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64">
                <LeftSidebar />
            </div>
            <div className="flex-1 flex flex-col items-center justify-start p-4">
                {profileData ? (
                    <div className="flex flex-col items-center">
                        <img
                            src={profileData.image}
                            alt={`${profileData.firstName} ${profileData.lastName}`}
                            className="rounded-full w-32 h-32 border-4 border-gray-300 shadow-lg cursor-pointer"
                            onClick={() => setModalOpen(true)}
                        />

                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-semibold text-gray-800">{profileData.firstName} {profileData.lastName}</h2>
                            <div className="flex space-x-4 mt-2">
                                <span className="text-gray-600">{profileData.followers.length} Followers</span>
                                <span className="text-gray-600">{profileData.following.length} Following</span>
                            </div>
                        </div>

                        {tokenUserId === userId && (
                            <div
                                className="bg-blue-600 flex align-middle text-white rounded-full w-24 h-24 border-4 border-gray-300 shadow-lg cursor-pointer mt-4"
                                onClick={() => setStoryModalOpen(true)}
                            >
                                <div className='mx-auto my-auto'>
                                    + Story
                                </div>
                            </div>
                        )}

                        {tokenUserId !== userId && (
                            <button
                                onClick={handleFollowUnfollow}
                                className={`mt-4 px-4 py-2 rounded-md ${isFollowing ? 'bg-gray-300 text-richblack-700' : 'bg-blue-600 text-white'}`}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}

                        {modalOpen && (
                            <div
                                className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                onClick={handleOutsideClick}
                            >
                                <div className="bg-white p-4 rounded-lg relative shadow-lg">
                                    <button
                                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                        onClick={closeModal}
                                    >
                                        &times;
                                    </button>
                                    <img
                                        src={profileData.image}
                                        alt={`${profileData.firstName} ${profileData.lastName}`}
                                        className="w-96 h-96 object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {storyModalOpen && (
                            <div
                                className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                onClick={handleOutsideClick}
                            >
                                <div className="bg-white p-6 rounded-lg relative shadow-lg">
                                    <button
                                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                        onClick={closeStoryModal}
                                    >
                                        &times;
                                    </button>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Create a Story</h3>
                                    <StoryCreation onBack={closeStoryModal} />
                                </div>
                            </div>
                        )}

                        
                        <div className="flex space-x-4 mt-8">
                            <button
                                className={`px-4 py-2 rounded-md ${selectedSection === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                onClick={() => setSelectedSection('posts')}
                            >
                                Posts
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${selectedSection === 'reels' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                onClick={() => setSelectedSection('reels')}
                            >
                                Reels
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${selectedSection === 'stories' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                onClick={() => setSelectedSection('stories')}
                            >
                                Stories
                            </button>
                        </div>

                        <div className="mt-6">
                            {selectedSection === 'posts' && <ProfilePosts userId={userId} />}
                            {selectedSection === 'reels' && <ReelProfile userId={userId} />}
                            {selectedSection === 'stories' && <StoryProfile userId={userId} />}
                        </div>
                    </div>
                ) : (
                    <div>No profile data available</div>
                )}
            </div>
        </div>
    );
};

export default Profile;
*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LeftSidebar from "../components/common/LeftSidebar";
import toast from 'react-hot-toast';
import StoryCreation from './StoryCreation';
import ProfilePosts from './ProfilePosts';
import ReelProfile from './ReelProfile';
import StoryProfile from './StoryProfile';

const Profile = () => {
    const { userId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [storyModalOpen, setStoryModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('posts');
    const [tokenUserId, setTokenUserId] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const fetchIdFromToken = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/profile/details', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setTokenUserId(response.data.userId);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProfileData = async (userId) => {
        try {
            const response = await axios.get('http://localhost:4000/api/profile/details2', {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProfileData(response.data.user);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || 'Error fetching profile');
            toast.error(error.response?.data?.message || 'Error fetching profile');
        }
    };

    const handleFollowUnfollow = async () => {
        try {
            const endpoint = isFollowing ? `unfollow/${userId}` : `follow/${userId}`;
            const method = isFollowing ? 'delete' : 'post';

            await axios({
                method: method,
                url: `http://localhost:4000/api/auth/${endpoint}`,
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsFollowing(!isFollowing);  // Toggle the following status
            toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
            fetchProfileData(userId);
        } catch (error) {
            toast.error('Action failed');
        }
    };

    useEffect(() => {
        if (userId) {
            fetchProfileData(userId);
        }
    }, [userId, isFollowing]);

    useEffect(() => {
        if (token) {
            fetchIdFromToken(token);
        }
    }, []);

    // Sync `isFollowing` state whenever `profileData` or `tokenUserId` changes
    useEffect(() => {
        if (profileData && tokenUserId) {
            setIsFollowing(profileData.followers.includes(tokenUserId));
        }
    }, [profileData, tokenUserId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const closeModal = () => setModalOpen(false);
    const closeStoryModal = () => setStoryModalOpen(false);

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
            setStoryModalOpen(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64">
                <LeftSidebar />
            </div>
            <div className="flex-1 flex flex-col items-center justify-start p-4">
                {profileData ? (
                    <div className="flex flex-col items-center">
                        <img
                            src={profileData.image}
                            alt={`${profileData.firstName} ${profileData.lastName}`}
                            className="rounded-full w-32 h-32 border-4 border-gray-300 shadow-lg cursor-pointer"
                            onClick={() => setModalOpen(true)}
                        />


                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-semibold text-gray-800">{profileData.firstName} {profileData.lastName}</h2>
                            {profileData.additionalDetails?.about && (
                                <div className="text-center ">
                                    <p className="text-gray-600 mt-2">{profileData.additionalDetails.about}</p>
                                </div>
                            )}
                            <div className="flex space-x-4 mt-2">
                                <span className="text-gray-600">{profileData.followers.length} Followers</span>
                                <span className="text-gray-600">{profileData.following.length} Following</span>
                            </div>
                        </div>



                        {tokenUserId === userId && (
                            <div
                                className="bg-blue-600 flex align-middle text-white rounded-full w-24 h-24 border-4 border-gray-300 shadow-lg cursor-pointer mt-4"
                                onClick={() => setStoryModalOpen(true)}
                            >
                                <div className='mx-auto my-auto'>
                                    + Story
                                </div>
                            </div>
                        )}

                        {tokenUserId !== userId && (
                            <button
                                onClick={handleFollowUnfollow}
                                className={`mt-4 px-4 py-2 rounded-md ${isFollowing ? 'bg-gray-300 text-richblack-700' : 'bg-blue-600 text-white'}`}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}

                        {/* Modal for Profile Image */}
                        {modalOpen && (
                            <div
                                className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                onClick={handleOutsideClick}
                            >
                                <div className="bg-white p-4 rounded-lg relative shadow-lg">
                                    <button
                                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                        onClick={closeModal}
                                    >
                                        &times;
                                    </button>
                                    <img
                                        src={profileData.image}
                                        alt={`${profileData.firstName} ${profileData.lastName}`}
                                        className="w-96 h-96 object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Modal for Story Creation */}
                        {storyModalOpen && (
                            <div
                                className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                onClick={handleOutsideClick}
                            >
                                <div className="bg-white p-6 rounded-lg relative shadow-lg">
                                    <button
                                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                        onClick={closeStoryModal}
                                    >
                                        &times;
                                    </button>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Create a Story</h3>
                                    <StoryCreation onBack={closeStoryModal} />
                                </div>
                            </div>
                        )}

                        {/* Horizontal Buttons for Posts, Reels, and Stories */}
                        <div className="flex space-x-4 mt-8">
                            <button
                                className={`px-4 py-2 rounded-md ${selectedSection === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                onClick={() => setSelectedSection('posts')}
                            >
                                Posts
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${selectedSection === 'reels' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                onClick={() => setSelectedSection('reels')}
                            >
                                Reels
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md ${selectedSection === 'stories' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                onClick={() => setSelectedSection('stories')}
                            >
                                Stories
                            </button>
                        </div>

                        {/* Render content based on selected section */}
                        <div className="mt-6">
                            {selectedSection === 'posts' && <ProfilePosts userId={userId} />}
                            {selectedSection === 'reels' && <ReelProfile userId={userId} />}
                            {selectedSection === 'stories' && <StoryProfile userId={userId} />}
                        </div>
                    </div>
                ) : (
                    <div>No profile data available</div>
                )}
            </div>
        </div>
    );
};

export default Profile;
