const nodemailer=require("nodemailer");
require("dotenv").config();
const mailsend=async(email,sub,body)=>{
    try{
       let transport=nodemailer.createTransport({
         host:process.env.HOST,
         auth:{
            user:process.env.MAIL,
            pass:process.env.APP_PASS,
         }
       })
       let data=await transport.sendMail({
         from:'StudyNotion-Sahil Kadam',
         to:`${email}`,
         sub:`${sub}`,
         html:`${body}`
       })
       console.log(data);
       return data;
    }catch(err){
        console.log("Error in utils folder")
        console.log(err);
    }
}

module.exports=mailsend;