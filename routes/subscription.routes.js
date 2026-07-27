const express=require("express")
const router=express.Router()
const authMiddleware=require("../middlewares/userAuth.middleware")
const subscriptionController=require("../controllers/subscription.controller")

router.get("/find-Subscription-by-user-id"  , subscriptionController.findSubscriptionByUserId )

module.exports=router