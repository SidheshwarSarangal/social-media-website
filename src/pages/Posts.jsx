import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftSidebar from '../components/common/LeftSidebar';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/auth/';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [isLikedByUser, setIsLikedByUser] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const navigate = useNavigate();
    const { postId } = useParams();
    const modalRef = useRef(null);
    const token = localStorage.getItem('token');

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async (postId) => {
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

    const handleCommentSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                `${API_BASE_URL}comment/${selectedPostId}`,
                { text: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success('Comment added successfully!');
                setNewComment(''); // Clear the input field
                fetchComments(selectedPostId); // Refresh comments to show the new comment
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment.');
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}comment/${selectedPostId}/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success('Comment deleted successfully!');
                fetchComments(selectedPostId); // Refresh comments after deletion
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment.');
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchPosts();
        }
    }, [navigate, token]);

    useEffect(() => {
        if (postId) {
            setSelectedPostId(postId);
            fetchLikeStatus(postId);
            fetchComments(postId); // Fetch comments for the selected post
        }
    }, [postId]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            if (response.data.success) {
                setPosts(response.data.posts);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLikeStatus = async (postId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}checkIfUserLikedPost/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIsLikedByUser(response.data.isLikedByUser);
            setLikesCount(response.data.likesCount || 0); // Initialize likesCount
        } catch (error) {
            console.error('Error fetching like status:', error);
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

    const handlePostClick = (postId) => {
        if (selectedPostId === postId) {
            return;
        }
        setSelectedPostId(postId);
        navigate(`/posts/${postId}`);
    };

    const closePostDetail = () => {
        setSelectedPostId(null);
        navigate('/posts');
    };

    const getSelectedPost = () => {
        return posts.find(post => post._id === selectedPostId);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closePostDetail();
        }
    };

    useEffect(() => {
        if (selectedPostId) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [selectedPostId]);

    const selectedPost = getSelectedPost();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex min-h-screen ">
            <div className="w-64">
                <LeftSidebar />
            </div>
            <div className="flex-1 w-7/12 p-4 bg-white">
                <h1 className="text-3xl font-semibold mb-4">Posts</h1>
                <div className="grid grid-cols-3 ml-28 mt-10 w-4/5 gap-2">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="cursor-pointer flex items-center justify-center rounded overflow-hidden"
                            onClick={() => handlePostClick(post._id)}
                        >
                            <img
                                src={post.image}
                                alt="Post"
                                className="object-cover hover:border-s-8"
                                style={{ height: 'auto', maxWidth: '100%' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Post Detail Modal */}
                {selectedPost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded-lg p-5 max-w-3xl mx-auto relative flex" ref={modalRef}>
                            <button onClick={closePostDetail} className="absolute top-2 right-2 text-gray-600">X</button>

                            {/* Left Side for Image */}
                            <div className="w-1/2 my-auto">
                                <img
                                    src={selectedPost.image}
                                    alt={selectedPost.caption}
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                            </div>

                            {/* Right Side for Post Details */}
                            <div className="w-1/2 pl-4">
                                <h3 className="text-lg font-semibold mb-2">Caption</h3>
                                <p className="text-gray-700 mb-4">{selectedPost.caption}</p>
                                <div className="flex items-center mb-2">
                                    <button
                                        onClick={toggleLike}
                                        className="flex items-center bg-gray-200 p-2 rounded-full transition-colors duration-200"
                                    >
                                        {isLikedByUser ? <AiFillLike className="text-blue-500" /> : <AiOutlineLike />}
                                        <span className="ml-2">{isLikedByUser ? 'Liked' : 'Like'}</span>
                                    </button>
                                    <span className="ml-4">{selectedPost.likes.length + likesCount} likes</span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                                    <div className="h-32 w-full border border-gray-300 rounded-md mb-4 overflow-y-auto p-2"> {/* Fixed height and width */}
                                        {comments.length === 0 ? (
                                            <p>No comments yet.</p>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment._id} className="border-b border-gray-300 py-1 flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        {comment.user.image && (
                                                            <img
                                                                src={comment.user.image}
                                                                alt="User Avatar"
                                                                className="h-8 w-8 rounded-full mr-2"
                                                            />
                                                        )}
                                                        <span className="font-semibold">{comment.user.firstName} {comment.user.lastName}:</span>
                                                        <span className="ml-2">{comment.text}</span>
                                                    </div>
                                                    <button onClick={() => deleteComment(comment._id)} className="text-red-500 ml-4">
                                                        Delete
                                                    </button>
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
        </div>
    );
};

export default Posts;
