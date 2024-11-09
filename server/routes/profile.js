const express = require('express');
const router = express.Router();
const profileController = require('../controllers/Profile');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');
/*
const multer = require('multer'); // For handling file uploads

const upload = multer({ dest: 'uploads/' });
*/

// Update Profile
router.put('/update', authMiddleware.auth, profileController.updateProfile);

// Delete Account
router.delete('/delete', authMiddleware.auth, profileController.deleteAccount);

// Get User Details
router.get('/details', authMiddleware.auth, profileController.getUserDetails);

router.get('/details2', authMiddleware.auth, profileController.getUserDetails2);



// Update Display Picture
router.put('/update-display-picture', authMiddleware.auth, upload.single('file'), profileController.updateDisplayPicture);


module.exports = router;
