const User=require("../models/User");
const otp=require("otp-generator");
const otpModel=require("../models/OTPgen");
const profile=require("../models/Profile");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const mailsender=require("../utils/mailsend");
require("dotenv").config()
exports.otpSending = async(req,res)=>{
     try{
        const {email}=req.body;
        const alreadyRegistered=await User.findOne({email});
    
        if(alreadyRegistered){
            res.status(401).json({
                success:false,
                message:"Already Registered, Go to Login Page"
            })
        }
    
        var OTP=otp.generate(5,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        
        const findOtp=await User.findOne({OTP});
        
        while(findOtp){
            OTP=otp.generate(5,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            findOtp=await User.findOne({OTP});
        }
        console.log("Generated OTP:",findOtp);
    
        
        const otpDbEntry=await otpModel.create({email,OTP});
        console.log(otpDbEntry);
    
        res.status(400).json({
            success:true,
            message:"OTP Sent Successfully"
        })
     }catch(err){
        console.log(err);
        res.status(401).json({
            success:false,
            message:"Error while sending OTP"
        })
     }
    
}


exports.signUp=async(req,res)=>{
    
    try{
        const {firstName,lastName,email,password,confirmPassword,
               accountType,contactNumber,otp}=req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp){
            res.status(401).json({
                success:false,
                message:"Please Fill all the Details"
            })
        }
        const alreadyRegistered=await User.findOne({email});
    
        if(alreadyRegistered){
            res.status(401).json({
                success:false,
                message:"Already Registered, Go to Login Page"
            })
        }
        if(password!==confirmPassword){
            res.status(401).json({
                success:false,
                message:"Both Passwords are not matchhing,Please enter same password in both the inputs"
            })
        }

       const otpFromDB=await otpModel.findOne({email}).sort({createdAt:-1}).limit(1);
       console.log(otpFromDB);
       if(otp!==otpFromDB){
            res.status(401).json({
                success:false,  
                message:"OTP is not matching, Please enter correct OTP"
            })
       }

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);
        
        
        const Profile=profile.create({
            DOB:null,
            gender:null,
            about:null,
            contactNumber
        })
        const userEntry=User.create({
            firstName,lastName,email,password:hashedPassword,accountType,
            additionalDetails:Profile._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

        })
        
        console.log(userEntry);
        
        return res.status(400).json({
            success:true,
            message:"Sign Up Done Successfully, You can Login Now",
            userEntry
        })

       

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error while registration, Please try again",
            
        })
    }
    

}

exports.Login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
           return res.status(403).json({
             success:false,
             message:"Please fill all the details correctly"
           })
        }  
        
        const user=await User.findOne({email}).populate("additionalDetails");
        console.log(user);

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Data not found, Do Registration first"
              })
        }

        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                role:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRETE,{
                expiresIn:"5h"
            })
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+5*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User Login Successfully"
            })
        }else{
            return  res.status(401).json({
                success:false,
                message:"Please Enter the Correct Password"
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Unable to Login, Please try again'
        })
    }
       


}


exports.changePassword=async(req,res)=>{
    try{
        const {email,oldPass,newPass,confirmNewPass}=req.body;

        const user=await User.findOne({email});
        console.log(user);
        if(user){
            if(oldPass===user.password){
                 if(newPass===confirmNewPass){
                    await db.User.updateOne(
                        { "email": "user.email" },  // Filter condition
                        {
                          $set: { "password": "newPass" }  // Update operation
                        }
                     )
                     await mailsender(email,"Password Change Email by StudyNotion","<h1>Password Change Successfully</h1>")
                 }else{
                    return res.status(401).json({
                        success:false,
                        message:"NewPassword and ConfirmNewPassword are not matching",
                    })
                 }
            }else{
                return res.status(401).json({
                    success:false,
                    message:"User has entered wrong old password",
                })
            }
        }else{
            return res.status(401).json({
                success:false,
                message:"User Not Found, Please Do Registration First",
            })
        }
    }catch(err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:"Error while Changing Password",
        })
    }
    
}