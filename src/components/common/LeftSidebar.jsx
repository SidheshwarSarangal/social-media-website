import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CreateModal from './CreateModal'; // Import the separate CreateModal component
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
const LeftSidebar = () => {
  const [isCreateBoxOpen, setCreateBoxOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fetchCurUserId = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/profile/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }

      });
      return response.data.userId;
    } catch (err) {
      console.log("Error fetching userid", err);
    }
  }
  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: (
        <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="5 12 3 12 12 3 21 12 19 12" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
          <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
        </svg>
      ),
    },
    {
      name: 'Search',
      path: '/search',
      icon: (
        <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <circle cx="10" cy="10" r="7" />
          <line x1="21" y1="21" x2="15" y2="15" />
        </svg>
      ),
    },
    {
      name: 'Posts',
      path: '/posts',
      icon: (
        <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="11" x2="21" y2="11" />
          <line x1="3" y1="15" x2="21" y2="15" />
        </svg>
      ),
    },
    {
      name: 'Reels',
      path: '/reels',
      icon: (
        <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="12" y1="7" x2="12" y2="17" />
          <line x1="7" y1="12" x2="17" y2="12" />
        </svg>
      ),
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: (
        <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
          <path d="M3 5h18a2 2 0 0 1 2 2v2l-4 2l-4-2l-4 2l-4-2V7a2 2 0 0 1 2-2z" />
        </svg>
      ),
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: (
        <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M15 17h5l-1.405 1.405a1 1 0 0 1-.707.295H3.293a1 1 0 0 1-.707-1.707L7 17h5" />
          <path d="M12 4v1a4 4 0 0 1-4 4H4a1 1 0 0 1-1-1V4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
        </svg>
      ),
    },
    /*{
      name: 'Profile',
      path: '/profile',
      icon: (
        <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <circle cx="12" cy="7" r="4" />
          <path d="M12 15c-4.418 0-8 2.686-8 6v1h16v-1c0-3.314-3.582-6-8-6z" />
        </svg>
      ),
    },*/
  ];

  const handleCreateClick = () => {
    setCreateBoxOpen(true);
  };

  const handleCloseCreateBox = () => {
    setCreateBoxOpen(false);
  };

  const handleToProfile = async () => {
    const userId = await fetchCurUserId();
    console.log(userId);
    navigate(`/profile/${userId}`)
  }

  const handleToBio = () => {
    navigate('/bio'); // Navigate to the Bio page
  }

  const handleLogout = () => {
    // Clear the token from localStorage to log out
    //localStorage.removeItem('token');
    navigate('/logout'); // Redirect to login page (or home page, as needed)
    // toast.success("Logged out successfully!");
  };

  return (
    <div className="w-64 h-screen bg-richblack-700 text-white flex flex-col items-start p-6 fixed">
      <h1 className="text-4xl font-bold mb-10">SOCIAL</h1>

      <nav className="flex flex-col gap-4 w-full">
        {navItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="text-lg flex items-center ml-2 hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 rounded-md p-2"
          >
            <svg className={`h-8 w-8 text-green-500`}>{item.icon}</svg>
            <div className='ml-4'>{item.name}</div>
          </Link>
        ))}

        <button
          onClick={handleToProfile}
          className="text-lg flex items-center ml-2 hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 rounded-md p-2"
        >
          <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx="12" cy="7" r="4" />
            <path d="M12 15c-4.418 0-8 2.686-8 6v1h16v-1c0-3.314-3.582-6-8-6z" />
          </svg>
          <div className='ml-4'>Profile</div>
        </button>

        <button
          onClick={handleCreateClick}
          className="text-lg flex items-center ml-2 hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 rounded-md p-2"
        >
          <svg className="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M12 4v16m8-8H4" />
          </svg>
          <div className='ml-4'>Create</div>
        </button>
      </nav>
      {/* Logout Button at the bottom */}
      <div className="mt-auto">
        <button
          onClick={handleToBio}
          className="text-2xl flex items-center ml-2 hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 rounded-md p-2"
        >
          
          <div className='ml-4'>Bio</div>
        </button>
        <button
          onClick={handleLogout}
          className="text-2xl flex items-center ml-2 hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 rounded-md p-2"
        >
          
          <div className='ml-4 text-red-500'>Log Out</div>
        </button>
      </div>

      <Toaster />

      {isCreateBoxOpen && <CreateModal onClose={handleCloseCreateBox} />}
    </div>
  );
};

export default LeftSidebar;