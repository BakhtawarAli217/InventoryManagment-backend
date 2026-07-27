const express=require("express")
const router=express.Router()
const itemContoller=require("../controllers/item.controller")
const authUser=require("../middlewares/userAuth.middleware")
const upload=require("../middlewares/upload")



router.post("/Add-item"  , upload.single("image") , itemContoller.addItem )
router.get("/Get-All-Items" , authUser.authUser , itemContoller.getAllItems)
router.delete("/Delete-Item/:id" , authUser.authUser , itemContoller.deleteItem)
router.get("/Get-Item/:id" , authUser.authUser , itemContoller.getItemById)
router.put("/Update-Item/:id" , authUser.authUser , itemContoller.updateItem)


module.exports=router