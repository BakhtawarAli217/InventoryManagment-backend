const express=require("express")
const categoryController=require("../controllers/category.controller")
const router=express.Router()
const authMiddleware=require("../middlewares/userAuth.middleware")


router.post("/Upload" , authMiddleware.authUser , categoryController.UploadCategory)
router.get("/Get-All-Categories" , authMiddleware.authUser , categoryController.getCategories)
router.delete("/Delete-Category/:id" , authMiddleware.authUser , categoryController.deleteCategory)

module.exports=router