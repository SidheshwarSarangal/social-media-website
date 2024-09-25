import React from 'react';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col items-start p-6 fixed">
      {/* Platform Name */}
      <h1 className="text-2xl font-bold mb-10">SOCIAL</h1>
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 w-full">
        <Link to="/" className="text-lg hover:text-gray-400">Home</Link>
        <Link to="/search" className="text-lg hover:text-gray-400">Search</Link>
        <Link to="/posts" className="text-lg hover:text-gray-400">Posts</Link>
        <Link to="/reels" className="text-lg hover:text-gray-400">Reels</Link>
        <Link to="/messages" className="text-lg hover:text-gray-400">Messages</Link>
        <Link to="/notifications" className="text-lg hover:text-gray-400">Notifications</Link>
        <Link to="/create" className="text-lg hover:text-gray-400">Create</Link>
        <Link to="/profile" className="text-lg hover:text-gray-400">Profile</Link>
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button className="text-lg hover:text-red-400">Log Out</button>
      </div>
    </div>
  );
};

export default LeftSidebar;
