import React from 'react';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

const PostDetailModal = ({ postId, posts, userLikes, onLikeToggle, onClose }) => {
    const selectedPost = posts.find(post => post._id === postId);

    if (!selectedPost) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-5 max-w-3xl mx-auto relative flex">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">X</button>

                {/* Left Side for Image */}
                <div className="w-1/2">
                    <img
                        src={selectedPost.image}
                        alt={selectedPost.caption}
                        className="w-full h-auto object-cover rounded-lg"
                    />
                </div>

                {/* Right Side for Post Details */}
                <div className="w-1/2 pl-5 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold mb-2">{selectedPost.caption}</h1>
                        <p className="text-gray-500 mb-2">Posted by: {selectedPost.user.firstName} {selectedPost.user.lastName}</p>
                        <p className="text-gray-500 mb-4">Posted on: {new Date(selectedPost.date).toLocaleDateString()}</p>

                        {/* Likes and Comments below Date */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                {/* Like Icon */}
                                {userLikes.has(selectedPost._id) ? (
                                    <AiFillLike 
                                        onClick={(e) => { e.stopPropagation(); onLikeToggle(selectedPost._id); }}
                                        className="text-blue-600 cursor-pointer"
                                        aria-label="Unlike"
                                    />
                                ) : (
                                    <AiOutlineLike 
                                        onClick={(e) => { e.stopPropagation(); onLikeToggle(selectedPost._id); }}
                                        className="cursor-pointer"
                                        aria-label="Like"
                                    />
                                )}
                                <span className="ml-1">{selectedPost.likes.length} Likes</span>
                            </div>
                            <div className="flex items-center">
                                {/* Comment Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    onClick={() => console.log('Show Comments')}
                                    aria-label="Show Comments"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9V3l-1 1-1-1v6H9l4 5 4-5h-3z" />
                                </svg>
                                <span className="ml-1">{selectedPost.comments.length} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
