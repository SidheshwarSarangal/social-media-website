import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client'; // Import socket.io-client
import ChatPane from './ChatPane';
import { Link } from 'react-router-dom';

const socket = io('http://localhost:4000'); // Connect to the backend server

function ChatComponent({ senderId, recipientId }) {
    const [chat, setChat] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [recipientDetails, setRecipientDetails] = useState(null);
    const [message, setMessage] = useState(''); // State for message input
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    // Initialize chat function
    const initializeChat = async () => {
        if (senderId === recipientId) {
            setErrorMessage("You can only talk to other people. You are trying to initialize chat with yourself.");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:4000/api/chat/getChat',
                { senderId, recipientId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setChat(response.data.chat);
                setErrorMessage('');
                fetchRecipientDetails();
                socket.emit('joinChat', response.data.chat._id); // Join the chat room
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error initializing chat.";
            setErrorMessage(message);
            toast.error(message);
        }
    };

    // Fetch recipient details
    const fetchRecipientDetails = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/profile/details2', {
                params: { userId: recipientId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setRecipientDetails(response.data.user);
            } else {
                toast.error("Unable to fetch recipient details.");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error fetching recipient details.";
            toast.error(message);
        }
    };

    // Handle message input
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    // Handle sending message
    const handleSendMessage = async () => {
        if (!message.trim()) return; // Don't send empty messages

        try {
            const response = await axios.post(
                'http://localhost:4000/api/chat/sendMessage',
                { chatId: chat._id, senderId, recipientId, text: message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                // Emit the message to other clients in the room
                socket.emit('sendMessage', {
                    chatId: chat._id,
                    message: response.data.chat.messages.slice(-1)[0] // Send the latest message
                });
                setMessage(''); // Clear the input
            } else {
                toast.error("Failed to send message.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error sending message.";
            toast.error(errorMessage);
        }
    };

    // Run initializeChat whenever senderId or recipientId changes
    useEffect(() => {
        if (senderId && recipientId) {
            initializeChat();
        }

        // Listen for incoming messages
        socket.on('message', (newMessage) => {
            setChat((prevChat) => ({
                ...prevChat,
                messages: [...prevChat.messages, newMessage] // Update state with new message
            }));
        });

        return () => {
            socket.off('message'); // Clean up socket listener
        };
    }, [senderId, recipientId]);

    return (
        <div className="chat-component flex flex-col h-screen">
            {errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ) : chat ? (
                <div className="flex flex-col flex-grow">
                    {/* Top blue bar with recipient's info */}
                    {recipientDetails && (
                        <div className="flex items-center bg-blue-600 text-white p-4 rounded-t-lg">
                            <Link to={`/profile/${recipientDetails._id}`} className="flex items-center">
                                <img
                                    src={recipientDetails.image}
                                    alt={`${recipientDetails.firstName} ${recipientDetails.lastName}`}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">{`${recipientDetails.firstName} ${recipientDetails.lastName}`}</h2>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Chat content (messages area) */}
                    <div className="flex-grow p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                        <ChatPane chatId={chat._id} senderId={senderId} recipientId={recipientId} socket={socket} />
                    </div>

                    {/* Text input bar at the bottom */}
                    <div className="p-4 bg-gray-100 rounded-b-lg flex items-center justify-between">
                        <textarea
                            className="w-full p-2 border rounded-md resize-none"
                            rows="1"
                            value={message}
                            onChange={handleMessageChange}
                            placeholder="Type a message..."
                            style={{
                                overflowY: 'hidden',
                                resize: 'none',
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="ml-2 p-2 bg-blue-600 text-white rounded-md"
                        >
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading chat...</p>
            )}
        </div>
    );
}

export default ChatComponent;
