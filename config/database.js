const mongoose=require("mongoose");
require("dotenv").config();

exports.connectDB=()=>{
     mongoose.connect(process.env.MONGODB_URL)
     .then(console.log("DB Connected Successfully"))
     .catch((err)=>{
        console.log("Issue while Connecting DB");
        console.log(err);
     })
}