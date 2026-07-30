const express=require("express")
const router=express.Router()
const userMiddleware=require("../middlewares/customerAuth.middleware")
const orderController=require("../controllers/order.controller")


router.post("/Create-Order" , userMiddleware.authCustomer , orderController.createOrder)




module.exports=router