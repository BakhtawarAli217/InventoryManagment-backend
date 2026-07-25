const express=require("express")
const router=express.Router()
const modelController=require("../controllers/model.controller")
const userAuth=require("../middlewares/userAuth.middleware")

router.post("/Create-Model" , userAuth.authUser , modelController.CreateModel)
router.get("/Get-All-Models" , userAuth.authUser , modelController.getAllModels)
router.delete("/Delete-Model/:id" , userAuth.authUser , modelController.deleteModel)
router.get("/Get-Model-By-Brand" , userAuth.authUser , modelController.getModelByBrand)


module.exports=router