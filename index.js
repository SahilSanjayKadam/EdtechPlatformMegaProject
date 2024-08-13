const express=require("express");
const app=express();
require("dotenv").config();
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`App is listening at port ${PORT}`)
});

const connectDB=require("./config/database");
connectDB.connectDB();