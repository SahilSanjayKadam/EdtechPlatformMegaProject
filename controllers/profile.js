const Profile=require("../models/Profile");
const User=require("../models/User");
const Course=require("../models/Course");

exports.updateProfile=async (req,res)=>{
    try{
        //data fetch
        const {DOB,gender,about,contactNumber}=req.body;
        const userID=request.user.id;
        const userDetails=await User.findById(userID);
        const profileID=userDetails.additionalDetails;
        let obj={};
        if(DOB){
            obj.DOB=DOB;
        }
        if(gender){
            obj.gender=gender;
        }
        if(about){
            obj.about=about;
        }
        if(contactNumber){
            obj.contactNumber=contactNumber;
        }
        const updatedProfileDB=await Profile(profileID,{
                                                        $set:obj
                                                    },{
                                                        new: true
                                                    });
        if (!updatedProfileDB) {
            return res.status(404).json({ error: 'User not found' });
        }
        
       
        res.status(200).json({
        message: 'Profile updated successfully',
        profile: updatedProfileDB
        });                                        
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}


exports.deleteAccount=async (req,res)=>{
    try{
        const userID=request.user.id;     
        const userDetails=await User.findById(userID);
        if(!userDetails){
            return res.status(404).json({ success:false,
                                   message:"User not found"
                                });
        }
        const profileID=userDetails.additionalDetails;

        //deleting enrolled courses
        const enrolledCourseIDs=userDetails.courses;


        //Approach 1
       //  for(let i=0;i<enrolledCourseIDs.length;i++){
       //      let id=enrolledCourseIDs[i];
       //      const updatedStudentsEnrolled=await Course.findByIdAndUpdate(id,{
       //         $pull:{studentsEnrolled:userID}
       //      },{new:true});
       //      console.log(updatedStudentsEnrolled);
       //  }


       //Approach 2 (Efficient)
        const courseUpdatePromises = enrolledCourseIDs.map(id => 
           Course.findByIdAndUpdate(id, {
               $pull: { studentsEnrolled: userID }
           }, { new: true })
        );

       await Promise.all(courseUpdatePromises);

        
        //deleting profile and account  
         await Profile.findByIdAndDelete(profileID);
         await User.findByIdAndDelete(userID);
         
         return res.status(200).json({
            success:true,
            message:"User Account Deleted Successfully"
         })
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getUserDetails=async(req,res)=>{
    try{
        const userID=req.user.id;
        const userDetails=await User.findById(userID).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:"User Details Fetched Successfully",
            userDetails
        })
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error while getting user details' });
    }
}