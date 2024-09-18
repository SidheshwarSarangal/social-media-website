const express = require('express');
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
