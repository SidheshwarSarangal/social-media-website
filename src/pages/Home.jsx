import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeftSidebar from "../components/common/LeftSidebar"; // Adjust the import path based on where the component is located
import HomeStories from "./HomeStories";  // Import your HomeStories component
import VerticalPosts from "./VerticalPosts";  // Import the VerticalPosts component
import UsersList from "./HomeRightSide";

function Home() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details from the backend
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get('http://localhost:4000/api/profile/details', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        }
      });
      setUserId(response.data.userId);  // Extract userId and set it
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64">
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8  bg-white shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">Home Page</h1>
        <p className="text-lg">Welcome to the home page.</p>

        {/* Stories Section - Fixed Horizontal Bar at the Top */}
        <div className="w-full overflow-hidden mb-4">
          {userId && <HomeStories userId={userId} />} {/* Pass userId to HomeStories */}
        </div>

        <div className="flex ">
          <div className="mt-8">
            {userId && <VerticalPosts userId={userId} />} {/* Pass userId to VerticalPosts */}
          </div>
          <div className='ml-16'>
            <UsersList/>
          </div>
        </div>

        {/* Main Content Below Stories */}
        
      </div>
    </div>
  );
}

export default Home;
