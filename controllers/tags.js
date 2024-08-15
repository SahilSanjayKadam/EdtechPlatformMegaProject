const tag=require("../models/Tag");

exports.createTag=async (req,res)=>{
    try{
      const {name,description}=req.body;
      if(!name || !description){
         return res.status(400).json({
            success:false,
            message:"Please Fill all the Details"
         })
      }
      const dbEntry=await tag.create({name,description});
      console.log(dbEntry);
      return res.status(400).json({
         success:true,
         message:`${name} Tag Created Successfully`
      })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error while creating a tag, Please try again"
         })
    }
}





exports.getAllTags=async (req,res)=>{
    try{
      const alltags=await tag.find({},{name:true,description:true}).toArray(); 
      console.log(alltags);
        return res.status(200).json({
            success:true,
            message:`All Tags Fetched Successfully`,
            alltags
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error while fetching tags, Please try again"
         })
    }
}