const Section=require("../models/Section");
const Course=require("../models/Course");


exports.createSection=async(req,res)=>{
      try{
        const {sectionName,courseID}=req.body;
        if(!sectionName || !courseID){
            return res.status(400).json({
                success:false,
                message:"Please Fill all the Details Required"
            })
        }
        const sectionDB=await Section.create({sectionName});
        const courseDBUpdated=await Course.findByIdAndUpdate(courseID,{
                                                                      $push: { content: sectionDB._id } 
                                                                    },
                                                                    {
                                                                        new: true, 
                                                                        runValidators: true
                                                                    }).populate({
                                                                        path: 'content',        // Populate the 'content' field
                                                                        populate: {
                                                                          path: 'subsections',  // Populate the 'subsections' field within each 'Section'
                                                                        }
                                                                      });
            return res.status(200).json({
                success:true,
                message:"Section Created Successfully",
                courseDBUpdated
            })
      }catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:"Error while updating    section",
                
            })
      }
}

exports.updateSection=async(req,res)=>{
    try{
        const {sectionName,sectionID}=req.body;
        if(!sectionName,!sectionID){
            return res.status(400).json({
                success:false,
                message:"Please Fill all the Details Required"
            })
        }
        const SectionDBUpdated=await Section.findByIdAndUpdate(sectionID,{ $set: {sectionName:sectionName}},{
                                                                                new: true, // Return the updated document
                                                                                runValidators: true // Validate before updating
                                                                            })
        console.log(SectionDBUpdated);
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
        })

    }catch(err){
          console.log(err);
          return res.status(500).json({
              success:false,
              message:"Error while creating section",
              
          })
    }
}


exports.deleteSection=async(req,res)=>{
    try{
        const {sectionID}=req.params;
        if(!sectionID){
            return res.status(400).json({
                success:false,
                message:"Please Fill all the Details Required"
            })
        }
        const SectionDBDeleted=await Section.findByIdAndDelete(sectionID);
        console.log(SectionDBDeleted);
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
        })

    }catch(err){
          console.log(err);
          return res.status(500).json({
              success:false,
              message:"Error while deleting section",
              
          })
    }
}