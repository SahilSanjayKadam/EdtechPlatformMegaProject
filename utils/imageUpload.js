const cloudinary=require("cloudinary").v2;

exports.uploadImage=async (file,folder,height,quality)=>{
    const options={folder,resource_type:'auto'};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }

    try {
        const result = await cloudinary.uploader.upload(file, options);
        return result;
    } catch (error) {
        console.error("Error uploading image:", error);
        
    }

}