const User = require('../models/User'); // Ensure this path is correct
const jwt = require('jsonwebtoken');


// Controller to fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding password and other sensitive data
        const users = await User.find({}, '-password -token -resetPasswordExpires');

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }

        // Respond with the list of users
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};



exports.getUserDetails = async (req, res) => {
  try {
    // Get the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token is missing' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    const userId = decoded.id;

    // Find the user by ID and exclude the password field
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Respond with user details
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    
    // Handle specific errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
/*
module.exports = {
  getUserDetails,
};*/
/*
exports.searchUsers = async (req, res) => {
  try {
      const { name } = req.query; // Get the name prefix from query parameters

      if (!name) {
          return res.status(400).json({ message: "Name prefix is required." });
      }

      // Perform a case-insensitive search on firstName and lastName using regex
      const users = await User.find({
          $or: [
              { firstName: { $regex: name, $options: 'i' } },
              { lastName: { $regex: name, $options: 'i' } }
          ]
      }).select('_id firstName lastName image email'); // Select only the required fields

      // Respond with the list of users
      res.status(200).json(users);
  } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};*/
/*
exports.searchUsers = async (req, res) => {
  try {
      const name = req.headers['name']; // Get the name prefix from request headers

      if (!name) {
          return res.status(400).json({ message: "Name prefix is required." });
      }

      // Perform a case-insensitive search on firstName and lastName using regex
      const users = await User.find({
          $or: [
              { firstName: { $regex: name, $options: 'i' } },
             { lastName: { $regex: name, $options: 'i' } }
          ]
      }).select('_id firstName lastName image email'); // Select only the required fields

      // Respond with the list of users
      res.status(200).json(users);
  } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};*/

exports.searchUsers = async (req, res) => {
  try {
      const namePrefix = req.headers['name']; // Get the name prefix from request headers

      if (!namePrefix) {
          return res.status(400).json({ message: "Name prefix is required." });
      }

      // Perform a case-insensitive prefix search on firstName using regex
      const users = await User.find({
          firstName: { $regex: `^${namePrefix}`, $options: 'i' } // `^` for prefix match
      }).select('_id firstName lastName image email'); // Select only the required fields

      // Respond with the list of users
      res.status(200).json(users);
  } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

