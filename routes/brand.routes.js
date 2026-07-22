const express=require("express")
const router=express.Router()
const brandController=require("../controllers/brand.controller")

router.post("/Upload-Brand" , brandController.uploadBrand)
router.get("/Get-All-Brands" , brandController.getAllBrands)
router.get("/Get-brand-By-Category" , brandController.getBrandByCategory)
router.delete("/Delete-Brand/:id" , brandController.deleteBrand)

module.exports=router