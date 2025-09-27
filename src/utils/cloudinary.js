import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath)=>{
   try {
    const response = await cloudinary.uploader.upload(localFilePath , {
        resource_type : 'auto'
    } )
    // file has been uploaded on cloudinary successfully
    // console.log("File uploaded on Cloudinary " , response.url);
    fs.unlinkSync(localFilePath)
     return response;
   } catch (error) {
     fs.unlinkSync(localFilePath); // to remove locally saved temporary file as upload operation failed

     return null;
   }
}

// cloudinary.v2.uploader.upload("/home/my_image.jpg", {upload_preset: "my_preset"}, (error, result)=>{
//   console.log(result, error);
// });

export {uploadOnCloudinary} 