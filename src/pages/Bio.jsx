import React, { useEffect, useState } from 'react';
import LeftSidebar from "../components/common/LeftSidebar";
import axios from 'axios';

function Bio() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const token = localStorage.getItem('token');
    const [editField, setEditField] = useState(null);
    const [file, setFile] = useState(null);

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        gender: '',
        dateOfBirth: '',
        about: '',
        image: '',
    });

    const fetchIdFromToken = async (token) => {
        try {
            const response = await axios.get('http://localhost:4000/api/profile/details', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserId(response.data.userId);
        } catch (error) {
            setError('Failed to fetch user ID.');
        }
    };

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/profile/details2', {
                params: { userId },
                headers: { Authorization: `Bearer ${token}` },
            });
            const userData = response.data.user;
            setUser(userData);
            setFormValues({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                contactNumber: userData.contactNumber || '',
                gender: userData.additionalDetails?.gender || '',
                dateOfBirth: userData.additionalDetails?.dateOfBirth || '',
                about: userData.additionalDetails?.about || '',
                image: userData.image || '',
            });
        } catch (err) {
            setError('Failed to fetch user details.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (field) => {
        try {
            const response = await axios.put(
                'http://localhost:4000/api/profile/update',
                { [field]: formValues[field] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data.user);
            setEditField(null);
        } catch (error) {
            setError("Failed to update profile.");
        }
    };

    const handleCancel = () => setEditField(null);

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.put(
                'http://localhost:4000/api/profile/update-display-picture',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setUser(response.data.user);
            setFormValues((prevValues) => ({
                ...prevValues,
                image: response.data.user.image,
            }));
            setEditField(null);
        } catch (error) {
            setError("Failed to upload image.");
        }
    };

    const handleInputChange = (field, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    useEffect(() => {
        if (token) {
            fetchIdFromToken(token);
        }
    }, [token]);

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    if (loading) return <p className="text-center text-xl mt-10">Loading...</p>;
    if (error) return <p className="text-center text-xl text-red-500 mt-10">{error}</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <LeftSidebar />
            <div className="flex-1 max-w-2xl mx-auto p-10 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold mb-6 text-blue-800">Bio Page</h1>
                <p className="text-xl font-medium text-gray-700 mb-8">Welcome, {user?.firstName || 'N/A'} {user?.lastName || 'N/A'}</p>

                <div className="space-y-8 mx-auto">
                    <section className="p-6 mx-auto rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-700 mb-4">User Details</h2>

                        <DetailBox
                            label="First Name"
                            value={formValues.firstName}
                            isEditing={editField === 'firstName'}
                            onEdit={() => setEditField('firstName')}
                            onSave={() => handleSave('firstName')}
                            onCancel={handleCancel}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />

                        <DetailBox
                            label="Last Name"
                            value={formValues.lastName}
                            isEditing={editField === 'lastName'}
                            onEdit={() => setEditField('lastName')}
                            onSave={() => handleSave('lastName')}
                            onCancel={handleCancel}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />

                        <DetailBox
                            label="Contact Number"
                            value={formValues.contactNumber}
                            isEditing={editField === 'contactNumber'}
                            onEdit={() => setEditField('contactNumber')}
                            onSave={() => handleSave('contactNumber')}
                            onCancel={handleCancel}
                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        />

                        <div className="p-4 bg-white rounded-lg shadow relative">
                            <p className="text-gray-600"><strong>Profile Image:</strong></p>
                            {formValues.image ? (
                                <div className="relative">
                                    <img src={formValues.image} alt="User" className="mt-2 rounded-lg shadow-md" width="100" />
                                    <button
                                        onClick={() => document.getElementById('fileInput').click()}
                                        className="absolute top-2 right-2 bg-gray-300 p-1 rounded-full"
                                    >
                                        ✎
                                    </button>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                <p className="mt-2 text-gray-500">No Image Available</p>
                            )}
                        </div>
                    </section>

                    <section className="p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">Profile Details</h2>
                        <DetailBox
                            label="Gender"
                            value={formValues.gender}
                            isEditing={editField === 'gender'}
                            onEdit={() => setEditField('gender')}
                            onSave={() => handleSave('gender')}
                            onCancel={handleCancel}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            isGenderSelect
                        />
                        <DetailBox
                            label="Date of Birth"
                            value={formValues.dateOfBirth}
                            isEditing={editField === 'dateOfBirth'}
                            onEdit={() => setEditField('dateOfBirth')}
                            onSave={() => handleSave('dateOfBirth')}
                            onCancel={handleCancel}
                            isDateInput
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                        <DetailBox
                            label="About"
                            value={formValues.about}
                            isEditing={editField === 'about'}
                            onEdit={() => setEditField('about')}
                            onSave={() => handleSave('about')}
                            onCancel={handleCancel}
                            onChange={(e) => handleInputChange('about', e.target.value)}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}

const DetailBox = ({ label, value, isEditing, onEdit, onSave, onCancel, onChange, isGenderSelect, isDateInput }) => (
    <div className="p-4 bg-white rounded-lg shadow mb-4 relative">
        <p className="text-gray-600"><strong>{label}:</strong></p>
        {isEditing ? (
            <>
                {isGenderSelect ? (
                    <select
                        value={value}
                        onChange={onChange}
                        className="border p-2 mt-1 w-full"
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                ) : isDateInput ? (
                    <input
                        type="date"
                        value={value}
                        onChange={onChange}
                        className="border p-2 mt-1 w-full"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        className="border p-2 mt-1 w-full"
                    />
                )}
                <div className="flex space-x-2 mt-2">
                    <button onClick={onSave} className="bg-blue-500 text-white px-4 py-1 rounded">Save</button>
                    <button onClick={onCancel} className="bg-red-500 text-white px-4 py-1 rounded">×</button>
                </div>
            </>
        ) : (
            <p className="text-gray-800 mt-1">{value || 'N/A'}</p>
        )}
        {!isEditing && (
            <button onClick={onEdit} className="absolute top-2 right-2 bg-gray-300 p-1 rounded-full">
                ✎
            </button>
        )}
    </div>
);
/*
const DetailBox = ({ label, value, isEditing, onEdit, onSave, onCancel, onChange, isGenderSelect, isDateInput }) => (
    <div className="p-4 bg-white rounded-lg shadow mb-4 relative">
        <p className="text-gray-600"><strong>{label}:</strong></p>
        {isEditing ? (
            <>
                {isGenderSelect ? (
                    <select
                        value={value}
                        onChange={onChange}
                        className="border p-2 mt-1 w-full"
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                ) : isDateInput ? (
                    <input
                        type="date"
                        value={value}
                        onChange={onChange}
                        className="border p-2 mt-1 w-full"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        className="border p-2 mt-1 w-full"
                    />
                )}
                <div className="flex space-x-2 mt-2">
                    <button onClick={onSave} className="bg-blue-500 text-white px-4 py-1 rounded">Save</button>
                    <button onClick={onCancel} className="bg-red-500 text-white px-4 py-1 rounded w-8 h-8 flex justify-center items-center">
                        <span className="text-xl">×</span>
                    </button>
                </div>
            </>
        ) : (
            <p className="text-gray-800 mt-1">{value || 'N/A'}</p>
        )}
        {!isEditing && (
            <button onClick={onEdit} className="absolute top-2 right-2 bg-gray-300 p-1 rounded-full">
                ✎
            </button>
        )}
    </div>
);*/


export default Bio;
