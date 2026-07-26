const Stripe=require("stripe")

const  stripe=new Stripe(process.env.SECRETE_KEY_STRIPE)

module.exports=stripe