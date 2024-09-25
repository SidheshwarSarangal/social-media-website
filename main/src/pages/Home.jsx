import React from 'react';
import LeftSidebar from "../components/common/LeftSidebar"; // Adjust the import path based on where the component is located

function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-8 ml-64 bg-white shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">Home Page</h1>
        <p className="text-lg">Welcome to the home page.</p>
      </div>
    </div>
  );
}

export default Home;
