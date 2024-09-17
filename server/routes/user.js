const express = require("express")
const router = express.Router()

const {
    login,
    signUp,
    sendotp,
    changePassword,
} = require("../controllers/Auth")

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword")

const { auth } = require("../middlewares/auth")

router.post("/login",login)

router.post("/signup", signUp)

router.post("/sendotp", sendotp)

router.post("/changepassword", auth, changePassword)


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router
