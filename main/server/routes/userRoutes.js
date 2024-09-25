const express = require('express');
const {getUserDetails}  = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Route to get user details
router.get("/user/details",     authMiddleware.auth,    getUserDetails);

module.exports = router;
