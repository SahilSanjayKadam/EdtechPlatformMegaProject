const Subsection=require("../models/Subsection");
const Section=require("../models/Section");
const {uploadImage}=require("../utils/imageUpload");
require("dotenv").config();
exports.createSubsection=async(req,res)=>{
     try{
      //fetching data
       const {title,duration,description,sectionID}=req.body;
       const videoFile = req.files.video; // 'video' is the field name used in the form
      //validation
       if (!videoFile) {
         return res.status(400).json({ message: "No video file uploaded" });
       }
       if(!title,!duration,!description){
         return res.status(400).json({ message: "Please fill all the data required" });
       }
       //uploading video on cloudinary and getting secure URL
       const videoUploaded=await uploadImage(videoFile,process.env.FOLDER_NAME);
       const videoUrl = videoUploaded.secure_url;
       //creating DB Entry in subsection
       const subsectionDBEntry=await Subsection.create({title,duration,description,videoURL:videoUrl});
       console.log(subsectionDBEntry);
       //Updating section object of perticular ID
       const updateSectionDB = await Section.findByIdAndUpdate(
         sectionID,
         {
           $push: { subSections: subsectionDBEntry._id }
         },
         {
           new: true
         }
       ).populate('subSections');
       console.log(updateSectionDB)
       return res.status(201).json({ success:true,
                              message: "Subsection created successfully", 
                              updateSectionDB });
     }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
     }
}

exports.updateSubsection=async(req,res)=>{
   try{
      const { title, duration, description, subsectionID } = req.body;
      const videoFile = req.files ? req.files.video : null;

      let updateFields = {};

      // Conditionally add fields to the update object
      if (title) updateFields.title = title;
      if (duration) updateFields.duration = duration;
      if (description) updateFields.description = description;

      if(videoFile){
         const videoUploaded=await uploadImage(videoFile,process.env.FOLDER_NAME);
         const videoUrl = videoUploaded.secure_url;
      }
      const updatedSubsection = await Subsection.findByIdAndUpdate(
         subsectionID,
         { $set: updateFields },
         { new: true, runValidators: true }
       );
       console.log(updatedSubsection);
       return res.status(200).json({ message: "Subsection updated successfully", subsection: updatedSubsection });

   }catch(err){
      console.log(err);
      res.status(500).json({ message: "Error while Updating Subsection" });
   }
}



exports.deleteSubsection=async(req,res)=>{
   try{
      const { subsectionID,sectionID } = req.body;
      
      const deletedSubsection = await Subsection.findOneAndDelete(subsectionID);
      if (!deletedSubsection) {
         return res.status(404).json({ message: "Subsection not found" });
      }
      const updatedSectionAfterDeletion=await Section.findByIdAndUpdate(
         sectionID,
         { $pull: { subSections: subsectionID } },
         { new: true }
       );

      return res.status(200).json({ message: "Subsection Deleted successfully", subsection: updatedSubsection });

   }catch(err){
      console.log(err);
      res.status(500).json({ message: "Error while Deleting Subsection" });
   }
}