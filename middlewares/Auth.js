const jwt=require("jsonwebtoken")


//Authentication
exports.auth=async (req,res,next)=>{
   try{
        const token=req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing"
            });
        }

        try{
                const decode =jwt.verify(token,process.env.JWT_SECRETE);
                console.log(decode);
                req.user=decode;
        }catch(err){
                return res.status(401).json({
                    success:false,
                    message:"Token is Invalid"
                });
        }
        next();
   }catch(err){
            console.log(err);
            return res.status(401).json({
                success:false,
                message:`Error has Occured while doing authntication ${err}`
            });
   }
}

//Authorization

//is Student
exports.isStudent=async (req,res,next)=>{
    try{
           if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:`This Route is only for Students`
            })
           }
           next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:`Error while verifying the User, Please try again`
        })
    }
}
//is Instructor
exports.isInstructor=async (req,res,next)=>{
    try{
           if(req.user.role!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:`This Route is only for Instructors`
            })
           }
           next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:`Error while verifying the User, Please try again`
        })
    }
}
//is Admin
exports.isAdmin=async (req,res,next)=>{
    try{
           if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:`This Route is only for Admins`
            })
           }
           next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:`Error while verifying the User, Please try again`
        })
    }
}