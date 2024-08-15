const Course=require("../models/Course");
const Tag=require("../models/Tag");
const User=require("../models/User");
const {uploadImage}=require("../utils/imageUpload");
require("dotenv").config();
exports.createCourse=async(req,res)=>{
    try{
       const {courseName,description,whatYouWillLearn,price,tag}=req.body;
       const {thumbNail}=req.files;
       
       if(!courseName || !description || !whatYouWillLearn || !price || !tag){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            })
       }

       const userID=req.user.id;
       const Instructor=await User.findById(userID);
       console.log("Instructor Details: ",Instructor);
       if(!Instructor){
            return res.status(404).json({
                success:false,
                message:`Instructor with ID ${userID} not found`
            })
       }

       const tagDetails=await Tag.findById(tag);
       console.log(tagDetails);

       if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:`Tag details not found`
            })
       }
       const Folder=process.env.FOLDER_NAME;
       const thumbNailImage=await uploadImage(thumbNail,Folder);

       const courseDBEntry=await Course.create({
        courseName,
        instructor:Instructor._id,
        description,
        whatYouWillLearn,price,tag,
        thumbNail:thumbNailImage.secure_url
       })

       const userUpdateDB=await User.findByIdAndUpdate({id:Instructor._id},{
                                                          $push:{
                                                            courses:courseDBEntry._id
                                                          }
                                                       },
                                                       {new:true}
                                                    )

      const tagUpdateDB=await Tag.findByIdAndUpdate({id:tag},{
                                                        $push:{
                                                        courses:courseDBEntry._id
                                                        }
                                                    },
                                                    {new:true})
       
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Error while Creating Course"
        })
    }
}


exports.getAllCourses=async(req,res)=>{
    try{
        const allCourses = await Course.find({}, {
            courseName: true,
            instructor: true,
            description: true,
            whatYouWillLearn: true,
            price: true,
            tag: true,
            thumbNail: true
        })
        .populate('instructor', 'name email')
        .exec(); 
        
       console.log(allCourses);
       return res.status(200).json({
        success:true,
        message:`All Tags Fetched Successfully`,
        allCourses
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while fetching Courses"
        })
    }
}