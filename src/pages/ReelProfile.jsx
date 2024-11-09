import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReelProfile = ({ userId }) => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReels = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/reels/user/${userId}`); // Replace with your actual endpoint
            console.log("Reels Fetched:", response.data);
            setReels(response.data.reels);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || 'Error fetching reels');
            toast.error(error.response?.data?.message || 'Error fetching reels');
        }
    };

    useEffect(() => {
        fetchReels();
    }, [userId]);

    if (loading) return <div>Loading reels...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reels.map(reel => (
                <div key={reel._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <video
                        controls
                        className="w-full h-48 object-cover"
                        src={reel.media}
                    />
                    <div className="p-4">
                        <p className="font-semibold">{reel.caption}</p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-600">{reel.likes.length} Likes</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReelProfile;
