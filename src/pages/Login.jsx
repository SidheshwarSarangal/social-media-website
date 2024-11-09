import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import MyImage from '../assets/logo-main.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                // Login successful, proceed
            }
        });
    };

    return (
        <div className="flex bg-black items-center justify-center h-screen bg-gray-100">
            <img src={MyImage} alt="Description" className="w-120 h-120 object-cover -ml-40 -mr-16" />
            <div className="w-full max-w-xs">
                <h1 className="text-3xl font-bold text-center mb-6">Login to X</h1>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-20">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-evenly ">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Login
                        </button>
                    </div>
                    <p className="text-center text-gray-600 text-xs mt-4">
                        Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-700">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
