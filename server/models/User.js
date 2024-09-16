const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstNmae: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type:String,
        required: true,
        trim:true
    },
    password: {
        type:String,
        required:true
    },
    additionalDetails: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    image:{
        type:String,
        required:true,
    },
    followers: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }],
    following: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }]

});

module.exports = mongoose,model("User", userSchema);