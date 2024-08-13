const mongoose=require("mongoose");
const mailsend = require("../utils/mailSend");

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
     },
     otp:{
        type:String,
        required:true
     },
     createdAt:{
        type:Date,
        default:Date.now(),
        expires:4*60
     }

});



async function EmailSender(email,otp){
   try{
       const res=await mailsend(email,"OTP Verification Email by StudyNotion",otp);
       console.log("Email Sent Successfully");
       console.log(res);
   }catch(err){
      console.log("Error while sending verification email")
      console.log(err);
   }
}

otpSchema.pre("save",async (next)=>{
    await EmailSender(this.email,this.otp);
    next();
})


module.exports=mongoose.model("OTPgen",otpSchema);