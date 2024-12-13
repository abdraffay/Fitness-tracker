const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");



// Image handle function 
const ImageLayer = () =>{
  
    cloudinary.config({
        cloud_name:process.env.MEDIA_CLOUD_NAME,
        api_key:process.env.MEDIA_API_KEY,
        api_secret:process.env.MEDIA_SECRET_KEY
    });

    const storage = new CloudinaryStorage({
        cloudinary:cloudinary,
        params:{
            folder:"users",
            allowed_files:["png","jpg"]
        }
    });
    const upload = multer({storage:storage});
    return upload;
}

module.exports = {ImageLayer}