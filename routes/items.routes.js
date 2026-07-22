const express=require("express")
const router=express.Router()
const itemContoller=require("../controllers/item.controller")


router.post("/Add-item" , itemContoller.addItem )
router.get("/Get-All-Items" , itemContoller.getAllItems)
router.delete("/Delete-Item/:id" , itemContoller.deleteItem)
router.get("/Get-Item/:id" , itemContoller.getItemById)
router.put("/Update-Item/:id" , itemContoller.updateItem)


module.exports=router