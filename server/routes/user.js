const express = require('express');
const router = express.Router();
const postController = require('../controllers/Post');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
//const upload = multer({ dest: 'uploads/' }); // Set up multer to handle file uploads
const { check } = require('express-validator');

const upload = multer({ dest: 'uploads/' }); // Set up multer for file uploads

// Routes for posts
router.post(
    '/create',
    authMiddleware.auth,
    upload.single('file'), // Handle file uploads
    check('caption').notEmpty().withMessage('Caption is required'),
    postController.createPost
);


router.get('/checkIfUserLikedPost/:postId', authMiddleware.auth, postController.checkIfUserLikedPost);





const {
    login,
    signup,
    sendOtp,
    changePassword,
} = require("../controllers/Auth")

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword")


const {
    followUser,
    unfollowUser,
    getNotifications
} = require("../controllers/Follow")

router.post("/login",login)

router.post("/signup", signup)

router.post("/sendotp", sendOtp)

router.post("/changepassword", authMiddleware.auth, changePassword)


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


router.get("/posts/:userId", authMiddleware.auth, postController.getUserPosts);

router.get('/', postController.getAllPosts);
router.put('/update/:postId', authMiddleware.auth, upload.single('file'), postController.updatePost);
router.delete('/delete/:postId', authMiddleware.auth, postController.deletePost);
router.post('/like/:postId', authMiddleware.auth, postController.likePost);
router.post('/unlike/:postId', authMiddleware.auth, postController.unlikePost);
router.get('/comments/:postId', authMiddleware.auth, postController.getCommentsByPostId);

router.post('/comment/:postId', authMiddleware.auth, check('text').notEmpty().withMessage('Text is required'), postController.commentOnPost);
router.delete('/comment/:postId/:commentId', authMiddleware.auth, postController.deleteCommentOnPost);
router.post('/follow/:userId', authMiddleware.auth, followUser);
router.delete('/unfollow/:userId', authMiddleware.auth, unfollowUser);
router.get('/notifications', authMiddleware.auth, getNotifications);


module.exports = router;
