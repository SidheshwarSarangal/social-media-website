// routes/chatRoutes.js
/*
const express = require('express');
const {
    createOrOpenChat,
    sendMessage,
    getUserChats,
    getChatMessages
} = require('../controllers/chatcontroller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create or open a DM with another user
router.post('/chat', authMiddleware.auth, createOrOpenChat);

// Route to send a message in a chat
router.post('/chat/:chatId/message', authMiddleware.auth, sendMessage);

// Route to get all chats of a user
router.get('/chat', authMiddleware.auth, getUserChats);

// Route to get chat history between two users
router.get('/chat/:chatId/messages', authMiddleware.auth, getChatMessages);

module.exports = router;*/


const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const chatController = require('../controllers/chatcontroller');

// Get or create a chat
router.post('/', authMiddleware.auth, chatController.getChat);

// Send a message
router.post('/send', authMiddleware.auth, chatController.sendMessage);

// Get messages for a chat
router.get('/messages/:chatId', authMiddleware.auth, chatController.getMessages);

module.exports = router;
