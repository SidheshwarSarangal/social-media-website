import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const UsersList = () => {
    const [users, setUsers] = useState([]);  // State to store the users
    const [loading, setLoading] = useState(true);  // State for loading indicator
    const [error, setError] = useState(null);  // State to store any errors
    const navigate = useNavigate();  // Initialize useNavigate hook

    useEffect(() => {
        // Fetch users on component mount
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users');  // Make API call
                if (response.data.success) {
                    setUsers(response.data.users.slice(0, 10));  // Set first 10 users
                }
            } catch (error) {
                setError('Failed to load users');
                toast.error('Failed to load users.');
            } finally {
                setLoading(false);  // Stop loading after the API call completes
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;  // Show loading message while fetching data
    if (error) return <div>{error}</div>;  // Display error message if something goes wrong

    const handleUserClick = (userId) => {
        // Navigate to the profile page of the clicked user
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="users-list max-w-md mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4 text-center">People/CONNECTIONS!!!! </h2>
            <div>
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="user-card flex items-center p-3 bg-white rounded-lg shadow-sm mb-3 cursor-pointer hover:bg-richblack-100 transition"
                        onClick={() => handleUserClick(user._id)} // Handle click event
                    >
                        <img 
                            src={user.image} 
                            alt={`${user.firstName} ${user.lastName}`} 
                            className="w-12 h-12 rounded-full mr-3"  // Smaller profile image
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;
