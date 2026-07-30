const prisma=require("../prismaClient")

module.exports.createOrder=async (req,res)=>{
    try{
        const {customer , products , amount , paymentId}=req.body
    
        const order=await prisma.order.create({
            data:{
                 userId:req.customer.id,
            customerData:customer,
            products,
            amount,
            paymentId,
            paymentStatus:"Paid",
            orderStatus:"Processing"
            }
           
        })
        return res.status(201).json({message:"Order submit successfully"})

    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}