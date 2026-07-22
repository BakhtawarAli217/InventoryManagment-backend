const express=require("express")
const categoryController=require("../controllers/category.controller")
const router=express.Router()


router.post("/Upload" , categoryController.UploadCategory)
router.get("/Get-All-Categories" , categoryController.getCategories)
router.delete("/Delete-Category/:id" , categoryController.deleteCategory)

module.exports=router