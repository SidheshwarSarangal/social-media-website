/*const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connect } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Database connection and Cloudinary
connect();
cloudinaryConnect();

// Routes
const authRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


----------------------------------------------------
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const { connect } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Database connection and Cloudinary setup
connect();
cloudinaryConnect();

// Routes
const authRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat'); // Add chat routes

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes); // Add chat routes

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on('sendMessage', ({ chatId, message }) => {
        io.to(chatId).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Server listening
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

*/

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const { connect } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Database connection and Cloudinary setup
connect();
cloudinaryConnect();

// Routes
const authRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat');
const storyRoutes = require('./routes/story');
const reelRoutes = require('./routes/reelRoutes');
const userRoutes = require('./routes/userRoutes'); // Ensure this path is correct



app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', userRoutes);

app.use('/api/stories', storyRoutes);
app.use('/api/reels', reelRoutes);

// Handle Socket.IO connections

app.use('/api/chat', chatRoutes);

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on('sendMessage', ({ chatId, message }) => {
        io.to(chatId).emit('message', message); // Broadcast to the specific chat
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Server listening
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
