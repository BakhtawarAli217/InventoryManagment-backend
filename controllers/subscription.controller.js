const prisma=require("../prismaClient")


module.exports.findSubscriptionByUserId=async (req,res)=>{
    try{
        const {id}=req.query
        if(!id){
            return res.status(400).json({message:"User id is required"})
        }
       
        const subscription=await prisma.order.findFirst({
            where:{
                userId:id
            }
        })
        if(!subscription){
        return res.status(404).json({message:"User have no subscription"})
        }
        if(subscription.status==="paid"){
            return res.status(200).json({message:"active"})
        }
        if(subscription.status==="pending"){
            return res.status(200).json({message:"Pending payment status"})
        }
        
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}