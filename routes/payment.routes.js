const express=require("express")
const router=express.Router()
const paymentController=require("../controllers/payment.controller")
const authmiddleware=require("../middlewares/userAuth.middleware")
const userAuth=require("../middlewares/customerAuth.middleware")

router.get("/create-checkout-session",authmiddleware.authUser , paymentController.createCheckOutSession)
router.post(
    "/webhook",
    paymentController.webhook
);

router.post("/create-payment" , paymentController.createPayment )

module.exports=router