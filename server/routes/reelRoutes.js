const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const reelController = require('../controllers/reelController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Assuming this is your multer config



router.get('/checkIfUserLikedReel/:reelId', authMiddleware.auth, reelController.checkIfUserLikedReel);

// Create Reel
router.post('/', authMiddleware.auth, upload.single('file'), reelController.createReel);


router.get('/', authMiddleware.auth, reelController.getAllReels);


router.get('/user/:userId', reelController.getReelsByUserId);

// Like Reel
router.post('/like/:reelId', authMiddleware.auth, reelController.likeReel);

// Unlike Reel
router.post('/unlike/:reelId', authMiddleware.auth, reelController.unlikeReel);

// Delete Reel
router.delete('/:reelId', authMiddleware.auth, reelController.deleteReel);

module.exports = router;
