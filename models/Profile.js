const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema({
     DOB:{
        type:String,
        required:true
     },
     gender:{
        type:String,
        enum:["male","female","other"],
        required:true
     },
     about:{
        type:String,
     },
     contactNumber:{
        
        type:Number,
        required:true
     }
     
});


module.exports=mongoose.model("Profile",profileSchema);