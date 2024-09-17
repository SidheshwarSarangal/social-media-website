const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
} = require("../controllers/Profile")

router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses




module.exports = router