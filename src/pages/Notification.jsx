import React, { useEffect, useState } from 'react';
import LeftSidebar from "../components/common/LeftSidebar"; // Adjust the import path based on where the component is located
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

function Notification() {
    const [notifications, setNotifications] = useState([]); // Default to empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const fetchUserNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/auth/notifications', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Check if the response has 'notifications' field and set it to state
            if (response.data.notifications) {
                setNotifications(response.data.notifications); // Correctly setting notifications from response
            } else {
                setNotifications([]); // If no notifications are found, set an empty array
            }
        } catch (error) {
            setError(error.message); // Correctly handling the error message
        } finally {
            setLoading(false); // Set loading to false after request completion
        }
    };

    useEffect(() => {
        fetchUserNotifications();
    }, []); // Empty dependency array to run only once when the component mounts

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner">Loading...</div> {/* Placeholder for loading spinner */}
            </div>
        ); // Show loading state
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-600">
                <span>Error: {error}</span>
            </div> // Show error message if there's an issue
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-64">
                <LeftSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-semibold mb-4 text-richblack-700">Notifications</h1>
                <div className="notification-dropdown space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
                            >
                                <div className="flex items-center">
                                    {/* Use Link to navigate to the user's profile */}
                                    <Link
                                        to={`/profile/${notification.actor._id}`}
                                        className="font-semibold text-richblack-700 hover:text-richblack-500"
                                    >
                                        {notification.actor.firstName} {notification.actor.lastName}
                                    </Link>
                                    <span className="ml-2 text-gray-500">
                                        {notification.action === 'follow'
                                            ? 'followed you'
                                            : 'unfollowed you'}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-richblack-700 text-center py-4">
                            No notifications available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notification;
