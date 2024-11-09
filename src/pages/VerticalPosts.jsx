import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:4000/api/auth/';

const VerticalPosts = ({ userId }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [userProfiles, setUserProfiles] = useState({});
    const [openComments, setOpenComments] = useState(null); // Track which post's comments are open
    const [imageModalUrl, setImageModalUrl] = useState(''); // Track the current image URL


    const [comment, setComment] = useState('');
    const [makeCommentModal, setMakeCommentModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);


    const handleCreateComment = (postId) => {
        setSelectedPostId(postId);
        setMakeCommentModal(true); // Open modal
    };

  //  const [openComments, setOpenComments] = useState(null);
    const [comments, setComments] = useState([]);

    const fetchComments = async (postId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${API_BASE_URL}comments/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments.');
        }
    };


    useEffect(() => {
        if (openComments) {
            fetchComments(openComments);  // Fetch comments for the post
        }
    }, [openComments]);  // Run when openComments changes




    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        const token = localStorage.getItem('token');


        try {
            const response = await axios.post(
                `${API_BASE_URL}comment/${selectedPostId}`,
                { text: comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success('Comment added successfully!');
                setComment(''); // Clear input field
                // fetchComments(selectedPostId); // Refresh comments
                setMakeCommentModal(false); // Close modal
            }
        } catch (error) {
            toast.error('Failed to add comment.');
        }
    };

    // Like-specific state
    const [likesData, setLikesData] = useState({}); // Store like status and count for each post

    const handleImageClick = (imageUrl) => {
        setImageModalUrl(imageUrl); // Set the clicked image URL
    };

    const handleCloseImageModal = () => {
        setImageModalUrl(''); // Close the modal by clearing the image URL
    };

    // Fetch user details
    /*
    
        const fetchNameDetails = async (xid) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/profile/details2', {
                    params: { xid },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if(response){
                    return response.data.user;
                }
                console.log("yyyyyy");
            } catch (error) {
                console.log(error);
            }
        };*/
    /*
        const fetchNameDetails = async (xid) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/profile/details2', {
                    params: { xid }, // Directly pass xid as a query parameter
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if (response.data) {
                    return response.data.user;
                }
                console.log("No response data");
            } catch (error) {
                console.log(error);
            }
        };*/


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
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Error fetching user details. Please try again later.');
        }
    };

    // Combine followers and following lists
    const combineLists = (following, followers) => {
        const combinedList = [...following, ...followers];
        const uniqueUsers = new Map();
        combinedList.forEach(user => {
            uniqueUsers.set(user._id, user);
        });

        return Array.from(uniqueUsers.values());
    };

    // Fetch profile details for all users
    const fetchUserProfiles = async (userList) => {
        const token = localStorage.getItem('token');
        const userProfileData = {};

        for (const user of userList) {
            try {
                const response = await axios.get('http://localhost:4000/api/profile/details2', {
                    params: { userId: user._id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (response.data && response.data.user) {
                    userProfileData[user._id] = response.data.user.profilePic;
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }

        setUserProfiles(userProfileData);
    };

    // Fetch posts created by the user and their followers/following
    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const following = userDetails?.following || [];
            const followers = userDetails?.followers || [];

            const uniqueUsers = combineLists(following, followers);
            uniqueUsers.push(userId); // Add the current userId to the list of unique users

            await fetchUserProfiles(uniqueUsers); // Fetch user profiles

            const allPosts = [];
            // Fetch posts for each unique user
            for (const user of uniqueUsers) {
                const response = await axios.get(
                    `${API_BASE_URL}posts/${user}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Extract like count from the likes array for each post
                const postsWithLikesCount = response.data.posts.map(post => ({
                    ...post,
                    likesCount: post.likes.length, // Get the number of likes from the likes array
                }));

                allPosts.push(...postsWithLikesCount); // Add posts to the array with updated like count
            }

            setPosts(allPosts); // Set posts with like count to state
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || 'Error fetching posts');
        }
    };

    // Fetch like status for each post
    const fetchLikeStatus = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}checkIfUserLikedPost/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setLikesData((prevLikesData) => ({
                ...prevLikesData,
                [postId]: {
                    isLikedByUser: response.data.isLikedByUser,
                    likesCount: response.data.likesCount || 0,
                }
            }));
        } catch (error) {
            console.error('Error fetching like status:', error);
        }
    };



    // Toggle like on post
    const toggleLike = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const { isLikedByUser } = likesData[postId] || {};
            const response = await axios.post(
                `${API_BASE_URL}${isLikedByUser ? 'unlike/' : 'like/'}${postId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // Toggle like status and update like count
                setLikesData((prevLikesData) => {
                    const currentLikes = prevLikesData[postId];
                    return {
                        ...prevLikesData,
                        [postId]: {
                            isLikedByUser: !currentLikes.isLikedByUser,
                            likesCount: currentLikes.likesCount + (currentLikes.isLikedByUser ? -1 : 1),
                        },
                    };
                });
                toast.success(`Post ${isLikedByUser ? 'unliked' : 'liked'} successfully!`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error toggling like status');
            console.error("Error toggling like status", error);
        }
    };

    // Handle opening all comments
    const handleOpenComments = (postId) => {
        setOpenComments(postId);
    };

    // Handle closing comments
    const handleCloseComments = () => {
        setOpenComments(null);
    };

    useEffect(() => {
        if (userId) fetchUserDetails();
    }, [userId]);

    useEffect(() => {
        if (userDetails) fetchPosts();
    }, [userDetails]);

    useEffect(() => {
        fetchPosts();
    }, [selectedPostId]);

    useEffect(() => {
        if (posts.length > 0) {
            posts.forEach(post => {
                fetchLikeStatus(post._id); // Fetch like status for each post
            });
        }
    }, [posts]);

    return (
        <div className="pl-4 pr-4">
            {loading && <div>Loading posts...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <p className="font-semibold text-2xl">Posts</p>
            <div className="space-y-8">
                {/* Render posts */}
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white rounded-xl shadow-lg p-6 max-w-xl transition-transform transform hover:scale-102"
                    >
                        {/* Header: User Info */}
                        <div className="mb-4">
                            <p className="font-semibold text-lg text-gray-900">
                                @{post.user.firstName} {post.user.lastName}
                            </p>
                        </div>

                        {/* Post Content */}
                        <img
                            src={post.image}
                            alt="Post Image"
                            className="w-full h-full object-cover rounded-lg mb-4"
                        />

                        <p className="text-md text-gray-800 mb-2">{post.caption}</p>

                        {/* Post Date */}
                        <p className="text-xs text-gray-500 mb-4">
                            Posted on {new Date(post.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between text-gray-600">
                            <div className="flex items-center space-x-3">
                                {/* Like Button with Icon and Colors */}
                                <button
                                    onClick={() => toggleLike(post._id)}
                                    className={`flex items-center px-3 py-1.5 rounded-full transition-colors duration-200 
                                      ${likesData[post._id]?.isLikedByUser ? 'bg-pink-500 text-white' : 'bg-blue-600 text-white'}`}
                                >
                                    {/* Icon (heart) can be added here */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5 mr-1.5"
                                    >
                                        <path
                                            d={likesData[post._id]?.isLikedByUser
                                                ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                                : "M12.1 18.55C8.14 15.14 5.5 12.39 5.5 9.5c0-1.92 1.56-3.5 3.5-3.5 1.19 0 2.34.63 3.1 1.58A3.5 3.5 0 0115.5 6c1.94 0 3.5 1.58 3.5 3.5 0 2.89-2.64 5.64-6.6 9.05z"}
                                        />
                                    </svg>
                                    {likesData[post._id]?.isLikedByUser ? 'Liked' : 'Like'}
                                </button>
                            </div>


                            {/* View Comments Button */}
                            <button
                                onClick={() => handleOpenComments(post._id)}
                                className="text-sm text-blue-500"
                            >
                                View all comments
                            </button>
                        </div>
                        <div className="space-y-2 mt-4">

                            {/*  {post.comments.length > 0 ? (<p className="font-semibold text-richblack-600">Some comments</p>) : (<p>No Comments</p>)}*/}
                            {post.comments.length > 0 && post.comments.slice(0, 2).map((comment, index) => (
                                <div key={index} className="flex flex-col space-y-1">
                                    <p className="font-semibold text-gray-900">@{comment.user.firstName} {comment.user.lastName}</p>
                                    <p className="text-gray-700">{comment.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 mt-4">
                            <button
                                onClick={() => handleCreateComment(post._id)}
                                className="bg-richblack-400 p-2 rounded-xl hover:bg-richblack-600 text-white"
                            >
                                Post a COMMENT!!!!
                            </button>
                        </div>


                        {/* Comments Modal */}
                        {openComments === post._id && (
                            <div
                                className="modal-background fixed inset-0 rounded-lg bg-black bg-opacity-50 flex items-center justify-center"
                                onClick={handleCloseComments}
                            >
                                <div
                                    className="modal-content w-[400px] h-[500px]  bg-white rounded-xl p-6 shadow-lg relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="absolute -top-16 -right-16 text-white"
                                        onClick={handleCloseComments}
                                    >
                                        X
                                    </button>
                                    <div className="space-y-4 p-6 max-h-[400px] overflow-y-auto">
                                        {comments.length > 0 ? (
                                            comments.map((comment, index) => (
                                                <div key={index} className="flex flex-col space-y-2">
                                                    <p className="font-semibold text-lg">{comment.user.firstName} {comment.user.lastName}</p>
                                                    <p className="text-md text-gray-700">{comment.text}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Loading comments...</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}



                    </div>
                ))}

                {makeCommentModal && (
                    <div className="fixed inset-0 bg-richblack-800 bg-opacity-75 flex justify-center h-auto items-center z-50">
                        <div className="bg-white p-6 rounded-md shadow-lg w-96">
                            <h2 className="text-lg font-bold mb-4">Add a Comment</h2>
                            <form onSubmit={handleCommentSubmit}>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                    rows="4"
                                    placeholder="Write your comment here..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => setMakeCommentModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default VerticalPosts;
