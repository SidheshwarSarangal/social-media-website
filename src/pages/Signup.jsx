import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendOtp, signup } from '../redux/slices/authSlice'; // Adjust the import based on your structure
import MyImage from '../assets/logo-main.jpg'; // Import your logo or image
import { useNavigate } from 'react-router-dom'; // Ensure this is imported

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        otp: ''
    });

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state for button disabling

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(sendOtp(formData.email)).unwrap(); // Ensure async action is handled properly
            setOtpSent(true);
        } catch (error) {
            console.error('Failed to send OTP:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { firstName, lastName, email, password, confirmPassword, contactNumber, otp } = formData;
        try {
            await dispatch(signup({ userDetails: { firstName, lastName, email, password, confirmPassword, contactNumber }, otp })).unwrap();
            navigate('/login'); // Navigate to the login page after successful signup
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-black items-center justify-center h-screen bg-gray-100">
            <img src={MyImage} alt="Description" className="w-120 h-120 object-cover -ml-40 -mr-16" />
            <div className="w-full max-w-xs">
                <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
                <form onSubmit={otpSent ? handleSignup : handleSendOtp} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-20">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="Contact Number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {otpSent && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter OTP"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-evenly">
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {otpSent ? 'Sign Up' : 'Send OTP'}
                        </button>
                    </div>
                    <p className="text-center text-gray-600 text-xs mt-4">
                        Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-700">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
