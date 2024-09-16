const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exportss.auth= async (req, res, next) => {
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "");

        if(!token){
            return res.status(401).json({
                success,
                message:'Token is missing'
            });
        }
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();


    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validatint the token',
        });
    }
}