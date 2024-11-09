import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import LeftSidebar from "../components/common/LeftSidebar"; // Adjust the import path based on where the component is located
import axios from 'axios'; // Ensure you have axios installed

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!searchTerm) {
            return; // Optionally handle empty search input
        }

        try {
            const response = await axios.get('http://localhost:4000/api/search', {
                headers: {
                    name: searchTerm // Send the search term in the headers
                }
            });
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleProfileClick = (userId) => {
        navigate(`/profile/${userId}`); // Navigate to the profile page with userId
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Sidebar */}
            <div>
                <LeftSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 ml-64 bg-white shadow-lg">
                {/* Centered Content */}
                <div className="text-center mb-6">
                    <p className="text-lg">Connect with people!!!!</p>
                    <h1 className="text-3xl font-semibold mb-4">Search</h1>
                </div>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <form onSubmit={handleSearch} className="flex items-center w-2/3">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Search Results */}
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Search Results:</h2>
                    {results.length > 0 ? (
                        <ul className="space-y-2">
                            {results.map(user => (
                                <li key={user._id} className="flex items-center p-2 border-b cursor-pointer" onClick={() => handleProfileClick(user._id)}>
                                    <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full mr-3" />
                                    <div>
                                        <h3 className="font-medium">{`${user.firstName} ${user.lastName}`}</h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No results found.</p> // Display this message if no results
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;
