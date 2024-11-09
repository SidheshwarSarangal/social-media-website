import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Posts from './pages/Posts';
import Reels from './pages/Reels';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Notification from './pages/Notification';
import Messages from './pages/Messages';
import Logout from './pages/Logout';
import Bio from './pages/Bio';
import { logout, setAuthenticated } from './redux/slices/authSlice';

const App = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true); // Add a loading state
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined') {
            localStorage.removeItem('token');
            dispatch(logout());
        } else {
            dispatch(setAuthenticated(true)); // Set authenticated state
        }
        setLoading(false); // Set loading to false after authentication check
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>; // Render a loading message while checking auth state
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/login" />} />
                <Route path="/posts/:postId?" element={isAuthenticated ? <Posts /> : <Navigate to="/login" />} /> {/* Allow postId */}
                <Route path="/reels" element={isAuthenticated ? <Reels /> : <Navigate to="/login" />} />
                <Route path="/profile/:userId?/:postId?" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/search" element={isAuthenticated ? <Search /> : <Navigate to="/login" /> } /> 
                <Route path="/notifications" element={isAuthenticated ? <Notification /> : <Navigate to="/login"/> } />
                <Route path="/messages/:userId?" element={isAuthenticated ? <Messages /> : <Navigate to="/login"/> } />
                <Route path="/logout" element={isAuthenticated ? <Logout /> : <Navigate to="/login"/> } />
                <Route path="/bio" element={isAuthenticated ? <Bio /> : <Navigate to="/login"/> } />
            </Routes>
        </Router>
    );
};

export default App;