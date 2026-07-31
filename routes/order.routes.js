const express=require("express")
const router=express.Router()
const userMiddleware=require("../middlewares/customerAuth.middleware")
const orderController=require("../controllers/order.controller")


router.post("/Create-Order" , userMiddleware.authCustomer , orderController.createOrder)

router.get("/Get-all-order" , orderController.getOrders)
router.delete("/delete-order" , orderController.deleteOrder)


module.exports=router