const express=require("express")
const router=express.Router()
const brandController=require("../controllers/brand.controller")
const authMiddleware=require("../middlewares/userAuth.middleware")

router.post("/Upload-Brand" , authMiddleware.authUser , brandController.uploadBrand)
router.get("/Get-All-Brands" , authMiddleware.authUser , brandController.getAllBrands)
router.get("/Get-brand-By-Category" , authMiddleware.authUser , brandController.getBrandByCategory)
router.delete("/Delete-Brand/:id" , authMiddleware.authUser , brandController.deleteBrand)


module.exports=router