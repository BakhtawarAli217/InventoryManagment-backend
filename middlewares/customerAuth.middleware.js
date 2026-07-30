const prisma=require("../prismaClient")
module.exports.authCustomer = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please log in first"
      });
    }
    if (req.user && req.user.id) {
      const prisma = require("../prismaClient");
      const customer = await prisma.customers.findUnique({
        where: {
          id: req.user.id
        }
      });
      
      if (!customer) {
        return res.status(403).json({
          success: false,
          message: "Access denied - Customer only"
        });
      }
      req.customer=customer
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};