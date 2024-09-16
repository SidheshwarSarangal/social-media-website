const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp: {
        type: String,
        require:true,
    },
    ceatedAt: {
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
});



async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, "Verification mail from Sociaaaal", otp);
        console.log("Email sent Successfully", mailResponse);
    }
    catch(error) {
        console.log("Error occured while sending mails",error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);