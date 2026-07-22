const express=require("express")
const router=express.Router()
const modelController=require("../controllers/model.controller")

router.post("/Create-Model" , modelController.CreateModel)
router.get("/Get-All-Models" , modelController.getAllModels)
router.delete("/Delete-Model/:id" , modelController.deleteModel)
router.get("/Get-Model-By-Brand" , modelController.getModelByBrand)


module.exports=router