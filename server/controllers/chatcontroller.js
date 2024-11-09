// controllers/chatController.js
/*
const User = require('../models/User');
const Chat = require('../models/Chat');

// Helper function to check if both users follow each other
const bothUsersFollowEachOther = async (userId, recipientId) => {
    const user = await User.findById(userId).populate('following');
    const recipient = await User.findById(recipientId).populate('followers');
    return user.following.some(followingUser => followingUser._id.equals(recipientId)) &&
           recipient.followers.some(followerUser => followerUser._id.equals(userId));
};

// Create or open a chat (DM) if both users follow each other
exports.createOrOpenChat = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const userId = req.user.id;

        // Ensure the recipient is not the same as the sender
        if (recipientId === userId) {
            return res.status(400).json({ success: false, message: "You cannot message yourself." });
        }

        // Check if both users follow each other
        const canChat = await bothUsersFollowEachOther(userId, recipientId);
        if (!canChat) {
            return res.status(403).json({ success: false, message: "You can only chat with users who follow you and whom you follow." });
        }

        // Check if the chat already exists
        let chat = await Chat.findOne({
            participants: { $all: [userId, recipientId] }
        });

        // If no chat exists, create a new one
        if (!chat) {
            chat = new Chat({
                participants: [userId, recipientId]
            });
            await chat.save();
        }

        return res.status(200).json({ success: true, chat });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating or opening chat.", error: error.message });
    }
};

// Send a message in an existing chat
exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        // Find the chat by ID
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }

        // Add the new message
        chat.messages.push({
            sender: userId,
            text,
            timestamp: Date.now()
        });

        await chat.save();

        return res.status(201).json({ success: true, message: "Message sent successfully.", chat });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error sending message.", error: error.message });
    }
};

// Get all chats for the logged-in user
exports.getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all chats where the user is a participant
        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'firstName lastName')
            .sort({ updatedAt: -1 });

        return res.status(200).json({ success: true, chats });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error retrieving chats.", error: error.message });
    }
};

// Get chat history between two users
exports.getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Find the chat by ID
        const chat = await Chat.findById(chatId)
            .populate('participants', 'firstName lastName')
            .populate('messages.sender', 'firstName lastName');

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }

        return res.status(200).json({ success: true, chat });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error retrieving chat messages.", error: error.message });
    }
};
*/

const Chat = require('../models/Chat');
const User = require('../models/User');

// Create or retrieve a chat


exports.getChat = async (req, res) => {
    try {
        const { senderId, recipientId } = req.body;

        // Find sender and recipient in the database
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        if (!sender || !recipient) {
            return res.status(404).json({ success: false, message: "Sender or recipient not found." });
        }

        // Check if sender follows recipient and recipient follows sender
        if (!sender.following.includes(recipientId) || !recipient.followers.includes(senderId)) {
            return res.status(403).json({ success: false, message: "You cannot chat with this user. Both users must follow each other." });
        }

        // Retrieve or create a chat
        let chat = await Chat.findOne({ participants: { $all: [senderId, recipientId] } });
        if (!chat) {
            chat = await Chat.create({ participants: [senderId, recipientId] });
        }

        return res.status(200).json({ success: true, chat });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error retrieving chat.", error });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, recipientId, chatId, text } = req.body;

        // Validate chat existence and user participation
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(senderId) || !chat.participants.includes(recipientId)) {
            return res.status(403).json({ success: false, message: "You cannot send messages in this chat." });
        }

        // Add the message to the chat
        const message = { sender: senderId, text };
        chat.messages.push(message);
        await chat.save();

        return res.status(200).json({ success: true, message: "Message sent.", chat });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error sending message.", error });
    }
};

/*
// Get messages for a chat
exports.getMessages = async (req, res) => {
    try {
        const { chatId, senderId, recipientId } = req.body;

        // Validate chat existence and user participation
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(senderId) || !chat.participants.includes(recipientId)) {
            return res.status(403).json({ success: false, message: "You cannot view messages in this chat." });
        }

        return res.status(200).json({ success: true, messages: chat.messages });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error retrieving messages.", error });
    }
};
*/

exports.getMessages = async (req, res) => {
    try {
        const { chatId, senderId, recipientId } = req.body;  // Accept data from the request body

        // Check if senderId, recipientId, or chatId are missing
        if (!chatId || !senderId || !recipientId) {
            return res.status(400).json({ success: false, message: "Missing required fields: chatId, senderId, or recipientId" });
        }

        // Validate chat existence
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }

        // Validate that both sender and recipient are participants in the chat
        if (!chat.participants.includes(senderId) || !chat.participants.includes(recipientId)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view messages in this chat."
            });
        }

        // If everything is valid, return the messages
        return res.status(200).json({ success: true, messages: chat.messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error retrieving messages.", error });
    }
};


