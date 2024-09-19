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
const chatController = require('../controllers/chatcontroller');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create or get a chat
router.post('/chat', authMiddleware.auth, chatController.createOrGetChat);

// Route to send a message
router.post('/message/:chatId', authMiddleware.auth, chatController.sendMessage);

module.exports = router;

