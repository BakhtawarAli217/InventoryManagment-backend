const stripe = require("../config/strip.config");
const prisma = require("../prismaClient");

module.exports.createCheckOutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: userId,
      },
    });

    if (existingOrder) {
      return res.json({
        message: "Payment already initiated",
        order: existingOrder,
      });
    }
    const order = await prisma.order.create({
      data: {
        userId: userId,
        amount: 1000,
        status: "Pending",
      },
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Package",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      metadata: {
        order: order.id,
      },
      success_url:
        "https://inventory-managment-software-chi.vercel.app/inventory",
      cancel_url: "https://inventory-managment-software-chi.vercel.app/",
    });

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        stripeSessionId: session.id,
      },
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};
module.exports.webhook = async (req,res)=>{
    try {
      console.log("Webhook received");

        const sig = req.headers["stripe-signature"];

   
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch(err) {
            console.log("Stripe signature error:", err.message);

            return res.status(400).json({
                error: err.message
            });
        }



        if(event.type === "checkout.session.completed"){

            const session = event.data.object;

           

            const orderId = session.metadata.order;


            await prisma.order.update({
                where:{
                    id: orderId
                },
                data:{
                    status:"Paid"
                }
            });

        }


        return res.status(200).json({
            received:true
        });


    } catch(e){

        console.log("WEBHOOK ERROR:", e);

        return res.status(500).json({
            error:e.message
        });
    }
};