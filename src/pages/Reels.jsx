import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeftSidebar from '../components/common/LeftSidebar';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000/api/reels/';

const Reels = () => {
    const [reels, setReels] = useState([]);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            toast.error('Please log in to view reels.');
            navigate('/login');
            return;
        }
        setToken(storedToken);
    }, [navigate]);

    // Fetch reels data from API
    const fetchReels = async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setReels(response.data.reels);
            } else {
                toast.error('Failed to load reels.');
            }
        } catch (error) {
            console.error('Error fetching reels:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                toast.error('Failed to load reels.');
            }
        }
    };

    useEffect(() => {
        if (token) {
            fetchReels();
        }
    }, [token]);

    const changeReel = (direction) => {
        setCurrentReelIndex((prevIndex) => {
            if (direction === 'next') {
                return Math.min(prevIndex + 1, reels.length - 1);
            } else {
                return Math.max(prevIndex - 1, 0);
            }
        });
    };

    const handleWheel = (event) => {
        event.preventDefault();
        changeReel(event.deltaY > 0 ? 'next' : 'prev');
    };

    useEffect(() => {
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [reels.length]);

    return (
        <div className="flex">
            <div className="w-64">
                <LeftSidebar />
            </div>
            <div className="flex-1 p-0 bg-gray-900 min-h-screen overflow-hidden relative">
                {reels.length > 0 ? (
                    <div className="relative h-screen overflow-hidden">
                        <div
                            className="reels-container transition-transform duration-500"
                            style={{
                                transform: `translateY(-${currentReelIndex * 100}vh)`,
                            }}
                        >
                            {reels.map((reel) => (
                                <div key={reel.id} className="reel flex flex-col items-center justify-center w-full h-screen relative">
                                    <video
                                        src={reel.media}
                                        controls
                                        className="z-10"
                                        style={{ width: '60%', height: 'auto' }}
                                    />
                                    <div className="reel-info p-4 text-center w-full mt-4">
                                        <p className="font-semibold text-black">{reel.caption}</p>
                                        <p className="text-gray-300">
                                            Posted by: {reel.user.firstName} {reel.user.lastName}
                                        </p>
                                        <p className="text-gray-300">
                                            Posted on: {new Date(reel.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-black">No reels available.</p>
                )}
            </div>
        </div>
    );
};

export default Reels;
