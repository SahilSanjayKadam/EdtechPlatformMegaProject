const User=require("../models/User");
const mailsend = require("../utils/mailSend");
const bcrypt=require("bcrypt");

exports.resetPasswordSendindLink=async (req,res)=>{
        try{
                    const {email}=req.body;
                    if(!email){
                        return res.status(401).json({
                            success:false,
                            message:"You have not written the email, please fill it"
                        })
                    }
                    const user=await User.findOne({email});
                    if(!user){
                        return res.status(401).json({
                            success:false,
                            message:"You have not done registration yet, Do registration first"
                        })
                    }
                    const token=crypto.randomUUID();

                    const updatedUser=await User.findOneAndUpdate({email},
                                                                {token:token,
                                                                    resetPassExp:Date.now+10*60*1000 
                                                                },
                                                                {new:true}
                    );
                    const passResetLink=`http://localhost:3000/reset-password/${token}`;
                    await mailsend(email,"Reset Password Link",`Reset Password Using this Link: ${passResetLink}`);

                    return res.json({
                            success:true,
                            message:"Email Sent Successfully to Reset the Password"
                    })


        }catch(err){
                    console.log(err);
                    return res.status(500).json({
                        success:false,
                        message:"Error while Reseting the password , please try again"
                    })
        }
}





exports.resetPassword=async(req,res)=>{
    try{
            const {password,confirmPassword,token}=req.body;
            const user=await User.findOne({token});

            if(!user){
                    return res.json({
                        success:false,
                        message:"User not found, Token is invalid"
                    })
            }

            if(user.resetPassExp<Date.now()){
                return res.json({
                    success:false,
                    message:"Token is expired, create your token again"
                })
        }


            if(password!==confirmPassword){
                    return res.json({
                        success:false,
                        message:"Password and ConfirmPassword are not matching"
                    })
            }

            
            const hashedPassword=bcrypt.hash(password,10);
            await User.findOneAndUpdate({token},
                {password:hashedPassword},
                {new:true}); 

            return res.status(200).json({
                success:true,
                message:"Password reset successfully"
            })
    }catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:"Error while resetting the password, please try again"
            })
    }
      
}