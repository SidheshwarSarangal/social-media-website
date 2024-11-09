const express = require('express');
const {getUserDetails , searchUsers, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Route to get user details
router.get("/user/details",     authMiddleware.auth,    getUserDetails);
router.get('/search', searchUsers);
router.get('/users', getAllUsers);


module.exports = router;
