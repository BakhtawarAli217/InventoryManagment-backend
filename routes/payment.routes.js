const express=require("express")
const router=express.Router()
const paymentController=require("../controllers/payment.controller")
const authmiddleware=require("../middlewares/userAuth.middleware")

router.get("/create-checkout-session",authmiddleware.authUser ,paymentController.createCheckOutSession)


module.exports=router