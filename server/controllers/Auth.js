const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already registered'
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated:", otp);

        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};


exports.signUp = async (req, res) => {


    try {

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            contactNumber,
            otp
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp || !contactNumber) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",

            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirmation password value do not match"
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already regstered"
            });
        }

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP found"
            });
        }
        else if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastNmae}`

        })

        return res.status(200).json({
            success: true,
            message: 'User is not registered',
            user,
        });


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cant be registered. Please try again",
        })


    }
};


exports.login = async (req,res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:'All fields are required'
            });
        }
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, sign up first",
            });
        }

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                //role: user.role,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token=token;
            user.password= undefined;

            const options = {
                expires: new Date(Date.now() + 3*34*60*60*100)
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in successfully',
            });
        }
        else{
            return res.status(401).json({
                sucess:false,
                message:'Password is incorrect',
            });
        }


    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        })

    }
};


exports.changePassword = async (req,res) => {
    
}