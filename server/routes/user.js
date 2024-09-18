const express = require('express');
const router = express.Router();
const postController = require('../controllers/Post');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set up multer to handle file uploads




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



router.post("/login",login)

router.post("/signup", signup)

router.post("/sendotp", sendOtp)

router.post("/changepassword", authMiddleware.auth, changePassword)


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)









// Create Post
router.post('/create', authMiddleware.auth, upload.single('image'), postController.createPost);

// Get All Posts
router.get('/', authMiddleware.auth, postController.getAllPosts);

// Update Post
router.put('/:postId/update', authMiddleware.auth, postController.updatePost);

// Delete Post
router.delete('/:postId/delete', authMiddleware.auth, postController.deletePost);

// Like/Unlike Post
router.put('/:postId/like', authMiddleware.auth, postController.likePost);

// Comment on Post
router.post('/:postId/comment', authMiddleware.auth, postController.commentOnPost);

module.exports = router;
