import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LeftSidebar from "../components/common/LeftSidebar"; // Adjust the import path based on where the component is located
import { logout } from '../redux/slices/authSlice';  // Ensure this is the correct import

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle "Yes" button click (logs out and redirects to login page)
  const handleConfirmLogout = () => {
    localStorage.removeItem('token');  // Clear the token from localStorage
    dispatch(logout());  // Update Redux state to reflect logout
    navigate('/login');  // Redirect to login page
  };

  // Handle "No" button click (redirects to home page)
  const handleCancelLogout = () => {
    navigate('/');  // Redirect to home page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className=''>
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64 bg-white shadow-lg flex flex-col justify-center items-center">
        <h1 className="text-3xl font-semibold mb-4">Logout</h1>
        <p className="text-lg mb-6">Are you sure you want to log out?</p>

        {/* Confirmation Buttons */}
        <div className="flex space-x-6">
          <button
            onClick={handleConfirmLogout}
            className="px-6 py-2 bg-pink-300 rounded-md text-white hover:bg-pink-400 transition-all duration-200 "
          >
            Yes
          </button>
          <button
            onClick={handleCancelLogout}
            className="px-6 py-2 bg-richblue-300 text-white rounded-md hover:bg-richblue-400 transition-all duration-200"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
