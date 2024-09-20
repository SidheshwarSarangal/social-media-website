const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const reelController = require('../controllers/reelController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Assuming this is your multer config

// Create Reel
router.post('/', authMiddleware.auth, upload.single('file'), reelController.createReel);

// Like Reel
router.post('/:reelId/like', authMiddleware.auth, reelController.likeReel);

// Unlike Reel
router.post('/:reelId/unlike', authMiddleware.auth, reelController.unlikeReel);

// Delete Reel
router.delete('/:reelId', authMiddleware.auth, reelController.deleteReel);

module.exports = router;
