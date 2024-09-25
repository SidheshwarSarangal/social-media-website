const express = require('express');
const router = express.Router();
const { createStory, likeStory, unlikeStory, deleteStory } = require('../controllers/storyController');
const { auth } = require('../middlewares/auth');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set up multer for file uploads

// Routes
router.post('/story', auth, upload.single('file'), createStory);  // To create a story
router.post('/story/like/:storyId', auth, likeStory);             // To like a story
router.post('/story/unlike/:storyId', auth, unlikeStory);         // To unlike a story
router.delete('/story/:storyId', auth, deleteStory);              // To delete a story

module.exports = router;
