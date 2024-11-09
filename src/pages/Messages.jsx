import React, { useState, useEffect } from 'react';
import LeftSidebar from "../components/common/LeftSidebar";
import ChatComponent from "./ChatComponent";
import { FiSearch, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

function Messages() {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [senderId, setSenderId] = useState(null); // New state for sender ID
    const [profileData, setProfileData] = useState(null);
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [recipientId, setRecipientId] = useState(null); // State for recipient ID
    const token = localStorage.getItem('token');

    // Fetch senderId (logged-in user ID) from the token
    useEffect(() => {
        const fetchSenderId = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/profile/details', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setSenderId(response.data.userId); // Set the senderId
            } catch (error) {
                console.log(error);
            }
        };
        fetchSenderId();
    }, [token]);

    // Fetch user profile data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/profile/details2', {
                    params: { userId: senderId },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(response.data.user);

                const followers = response.data.user.followers;
                const following = response.data.user.following;

                const fetchUsersData = async (userIds) => {
                    try {
                        const users = await Promise.all(
                            userIds.map(async (userId) => {
                                const userResponse = await axios.get('http://localhost:4000/api/profile/details2', {
                                    params: { userId },
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                return userResponse.data.user;
                            })
                        );
                        return users;
                    } catch (error) {
                        toast.error(error.response?.data?.message || 'Error fetching user details');
                    }
                };

                const followersDetails = await fetchUsersData(followers);
                const followingDetails = await fetchUsersData(following);

                setFollowersData(followersDetails);
                setFollowingData(followingDetails);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching profile');
            }
        };

        if (senderId) {
            fetchProfileData();
        }
    }, [senderId, token]);

    // Handle clearing the search text
    const handleClear = () => setSearchText('');

    // Debounced search function
    useEffect(() => {
        if (!searchText) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/search', {
                    headers: { name: searchText }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    // Combine followers and following and remove duplicates
    const combinedUsers = [
        ...followersData,
        ...followingData.filter(followingUser => !followersData.some(follower => follower._id === followingUser._id))
    ];

    return (
        <div className="flex max-h-screen bg-gray-100">
            <div className="w-64">
                <LeftSidebar />
            </div>

            <div className="w-96 bg-white shadow-lg flex flex-col items-center p-4">
                <div className="mb-4 font-bold text-gray-700 text-xl">Talk To People!</div>
                
                <div className="relative w-full flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    {searchText && (
                        <button onClick={handleClear} className="absolute right-4 text-gray-500 hover:text-gray-700">
                            <FiX />
                        </button>
                    )}
                </div>

                {searchText === '' && (
                    <div className="mt-6 w-full">
                        <h3 className="font-bold text-lg mb-2">People</h3>
                        <ul className="space-y-2">
                            {combinedUsers.length > 0 ? (
                                combinedUsers.map((user) => (
                                    <li 
                                        key={user._id} 
                                        onClick={() => setRecipientId(user._id)} // Set recipientId on click
                                        className="flex items-center p-2 border-b cursor-pointer"
                                    >
                                        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <h3 className="font-medium">{`${user.firstName} ${user.lastName}`}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No followers or following yet.</p>
                            )}
                        </ul>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : searchResults.length > 0 ? (
                    <ul className="w-full space-y-2">
                        {searchResults.map(user => (
                            <li 
                                key={user._id} 
                                onClick={() => setRecipientId(user._id)} // Set recipientId on click
                                className="flex items-center p-2 border-b cursor-pointer"
                            >
                                <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <h3 className="font-medium">{`${user.firstName} ${user.lastName}`}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    searchText && (
                        <p className="text-gray-500 mt-4">No results found.</p>
                    )
                )}
            </div>

            <div className="flex-1 p-8 bg-white shadow-lg">
                {recipientId ? (
                    <ChatComponent  senderId={senderId} recipientId={recipientId} />
                ) : (
                    <p className="text-gray-500">Select a person to start chatting</p>
                )}
            </div>
            
        </div>
    );
}

export default Messages;
