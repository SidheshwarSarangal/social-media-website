const express = require('express');
const router = express.Router();
const profileController = require('../controllers/Profile');
const authMiddleware = require('../middlewares/auth');

// Update Profile
router.put('/update', authMiddleware.auth, profileController.updateProfile);

// Delete Account
router.delete('/delete', authMiddleware.auth, profileController.deleteAccount);

// Get User Details
router.get('/details', authMiddleware.auth, profileController.getUserDetails);

// Update Display Picture
router.put('/update-picture', authMiddleware.auth, profileController.updateDisplayPicture);

module.exports = router;
