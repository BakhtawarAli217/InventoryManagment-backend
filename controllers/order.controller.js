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

module.exports.getOrders=async (req,res)=>{
    try{
        const {page , limit}=req.query
        const parsedPage=parseInt(page)
        const parsedLimit=parseInt(limit)
        const skip=(parsedPage-1)*limit
        const orders=await prisma.order.findMany({
            skip,
            take:parsedLimit,
            orderBy:{
                createdAt:"desc"
            },
            include:{
                user:true
            }
        })
        const total=await prisma.order.count()
        const hasMore=orders.length+skip<total
        return res.status(200).json({message:"Order Fetched Successfully" , data:orders , total:total  , hasMore:hasMore})
    }catch(e){
        console.log(e)
        return res.status(500).json({message:"Order Fetched Successfully" , error:e.message})
    }
}

module.exports.deleteOrder=async (req,res)=>{
    try{
        const {id}=req.query
        if(!id){
            return res.status(400).json({message:"Id is required"})
        }
        const order=await prisma.order.findUnique({
            where:{
                id
            }
        })
        if(!order){
            return res.status(404).json({message:"Invalid Order Id"})
        }
        await prisma.order.delete({
            where:{
                id
            }
        })
        return res.status(200).json({message:"Order deleted successfully"})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}

module.exports.getOrderById=async (req,res)=>{
    try{
        const {id}=req.params
        if(!id){
            return res.status(400).json({message:"Id is required"})
        }
        const order=await prisma.order.findUnique({
            where:{
                id
            }
        })
        if(!order){
            return res.status(404).json({message:"Invalid Id"})
        }
        return res.status(200).json({message:"Order Fetched Successfully" , data:order})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" ,error:e.message})
    }
}