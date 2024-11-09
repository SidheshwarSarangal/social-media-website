import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/auth/';

const ProfilePosts = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [isLikedByUser, setIsLikedByUser] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else if (userId) {
            fetchUserPosts(userId);
        }
    }, [navigate, token, userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closePostDetail();
            }
        };
        if (selectedPostId) {
            window.addEventListener("mousedown", handleClickOutside);
            fetchComments(selectedPostId); // Fetch comments when post is selected
            fetchLikeStatus(selectedPostId); // Fetch like status when post is selected
        }
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedPostId]);

    const fetchUserPosts = async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/posts/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(response.data.success ? response.data.posts : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePostClick = (postId) => setSelectedPostId((prev) => (prev !== postId ? postId : null));
    const closePostDetail = () => setSelectedPostId(null);
    const getSelectedPost = () => posts.find(post => post._id === selectedPostId);

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}comments/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(response.data.success ? response.data.comments : []);
        } catch {
            toast.error('Failed to load comments.');
        }
    };

    const fetchLikeStatus = async (postId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}checkIfUserLikedPost/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsLikedByUser(response.data.isLikedByUser);
            setLikesCount(response.data.likesCount || 0); // Initialize likesCount
        } catch (error) {
            console.error('Error fetching like status:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                `${API_BASE_URL}comment/${selectedPostId}`,
                { text: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success('Comment added successfully!');
                setNewComment('');
                fetchComments(selectedPostId); // Refresh comments after adding
            }
        } catch {
            toast.error('Failed to add comment.');
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}comment/${selectedPostId}/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                toast.success('Comment deleted successfully!');
                fetchComments(selectedPostId); // Refresh comments after deletion
            }
        } catch {
            toast.error('Failed to delete comment.');
        }
    };

    const toggleLike = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${isLikedByUser ? 'unlike/' : 'like/'}${selectedPostId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setIsLikedByUser(!isLikedByUser);
                setLikesCount(prev => prev + (isLikedByUser ? -1 : 1)); // Update like count
                toast.success(`Post ${isLikedByUser ? 'unliked' : 'liked'} successfully!`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error toggling like status');
            console.error("Error toggling like status", error);
        }
    };

    const selectedPost = getSelectedPost();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex relative flex-wrap">
            <div className="grid z-10 grid-cols-3 gap-4 w-full">
                {posts.map(post => (
                    <div key={post._id} className="relative">
                        <img
                            src={post.image}
                            alt="Post"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handlePostClick(post._id)}
                        />
                    </div>
                ))}
            </div>

            {selectedPost && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-5 max-w-3xl mx-auto relative flex z-60" ref={modalRef}>
                        <button onClick={closePostDetail} className="absolute top-2 right-2 text-gray-600 z-70">X</button>

                        <div className="w-1/2">
                            <img src={selectedPost.image} alt={selectedPost.caption} className="w-full h-auto object-cover rounded-lg" />
                        </div>

                        <div className="w-1/2 pl-4">
                            <h3 className="text-lg font-semibold mb-2">Caption</h3>
                            <p className="text-gray-700 mb-4">{selectedPost.caption}</p>
                            <div className="flex items-center mb-2">
                                <button onClick={toggleLike} className="flex items-center bg-gray-200 p-2 rounded-full">
                                    {isLikedByUser ? <AiFillLike className="text-blue-500" /> : <AiOutlineLike />}
                                    <span className="ml-2">{isLikedByUser ? 'Liked' : 'Like'}</span>
                                </button>
                                <span className="ml-4">{selectedPost.likes.length + likesCount} likes</span>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                                <div className="h-32 w-full border border-gray-300 rounded-md mb-4 overflow-y-auto p-2">
                                    {comments.length === 0 ? (
                                        <p>No comments yet.</p>
                                    ) : (
                                        comments.map(comment => (
                                            <div key={comment._id} className="border-b border-gray-300 py-1 flex justify-between items-center">
                                                <div className="flex items-center">
                                                    {comment.user.image && (
                                                        <img src={comment.user.image} alt="User Avatar" className="h-8 w-8 rounded-full mr-2" />
                                                    )}
                                                    <span className="font-semibold">{comment.user.firstName} {comment.user.lastName}:</span>
                                                    <span className="ml-2">{comment.text}</span>
                                                </div>
                                                <button onClick={() => deleteComment(comment._id)} className="text-red-500 ml-4">Delete</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <form onSubmit={handleCommentSubmit} className="flex">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="border border-gray-300 rounded-md flex-1 p-2 mr-2"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-4 rounded-md">Post</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePosts;
