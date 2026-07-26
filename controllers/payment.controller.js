const stripe=require("../config/strip.config")
const prisma=require("../prismaClient")

module.exports.createCheckOutSession=async (req,res)=>{
    try{
        const userId=req.user.id
        const order=await prisma.order.create({
            data:{
                userId:userId,
                amount:1000,
                status:"Pending"
            }
        })
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            line_items:[
                {
                    price_data:{
                        currency:"usd",
                        product_data:{
                            name:"Premium Package"
                        },
                        unit_amount:1000
                    },
                    quantity:1
                }
            ],
          metadata:{
            order:order.id
          },
            success_url:"https://inventory-managment-software-chi.vercel.app/inventory",
            cancel_url:"https://inventory-managment-software-chi.vercel.app/"
        })

        await prisma.order.update({
            where:{
                id:order.id
            },
            data:{
                stripeSessionId:session.id
            }
        })

        return res.status(200).json({
            url:session.url
        });

    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}