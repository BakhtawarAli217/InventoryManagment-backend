const cloudinary=require("../config/cloudinary.config")
const {CloudinaryStorage}=require("multer-storage-cloudinary")
const multer=require("multer")

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"subLimeLogic"
    }
})

const upload=multer({storage:storage})

module.exports=upload