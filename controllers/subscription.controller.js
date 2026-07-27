const prisma=require("../prismaClient")

module.exports.findSubscriptionByUserId = async (req, res) => {
  try {
    const { id } = req.query;

    const subscription = await prisma.order.findFirst({
      where: {
        userId: id,
      },
    });

    

    if (!subscription) {
      return res.status(200).json({message:"Subscription Not Found"});
    }


    return res.status(200).json({
      message: "Sucsription fetched successfully" , data:subscription
    });

  } catch (e) {
    console.error(e);

    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};