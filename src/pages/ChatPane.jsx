import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPane = ({ chatId, senderId, recipientId, socket }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const fetchMessages = async () => {
        try {
            const response = await axios.post(
                'http://localhost:4000/api/chat/getMessages',
                { chatId, senderId, recipientId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setMessages(response.data.messages);
            } else {
                setError('Failed to fetch messages');
            }
        } catch (err) {
            setError('Error fetching messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(); // Initial fetch on mount

        // Polling logic: fetch messages every 5 seconds
        const intervalId = setInterval(fetchMessages, 5000);

        // Listen for incoming messages through the passed socket instance
        socket.on('message', (newMessage) => {
            if (newMessage.chatId === chatId) {
                setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the new message
            }
        });

        // Cleanup the socket event listener and polling interval when the component unmounts
        return () => {
            socket.off('message');
            clearInterval(intervalId); // Clear polling interval
        };
    }, [chatId, senderId, recipientId, token, socket]);

    if (loading) {
        return <div>Loading messages...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="chat-pane flex max-h-fit flex-col gap-2 p-4 ">
            {messages.length === 0 ? (
                <div>No messages yet.</div>
            ) : (
                messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message flex flex-col max-w-[70%] p-2 rounded-xl text-sm ${
                            message.sender === senderId
                                ? 'bg-blue-100 self-end'
                                : 'bg-richblack-200 self-start'
                        }`}
                    >
                        <p>{message.text}</p>
                        <small className="text-gray-500 mt-1">
                            {new Date(message.timestamp).toLocaleString()}
                        </small>
                    </div>
                ))
            )}
        </div>
    );
};

export default ChatPane;
