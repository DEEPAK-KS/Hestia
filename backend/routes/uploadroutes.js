const express = require("express")
const router = express.Router();
const multer = require("multer")
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier")

require("dotenv").config();

// cloudinart Config
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// MULTER CONGIF
const storage = multer.memoryStorage();
const upload = multer({storage})

router.post("/", upload.single("image"), async (req,res) =>{
    try {
        if (!req.file){
            return res.status(400).json({message:"No file uploaded"});
        }
        // function to handle stream upload to cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) =>{
                const stream = cloudinary.uploader.upload_stream((error,result)=>{
                    if (result) {
                        resolve(result);            
                    } else {
                        reject(error)
                    }
                });
                // use stream Buffer to convert file buffer to stream
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }
        // Call the streamupload function
        const result = await streamUpload(req.file.buffer)

        // respond with the upload image URL
        res.json({imageUrl: result.secure_url})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})
    }
})

module.exports = router;