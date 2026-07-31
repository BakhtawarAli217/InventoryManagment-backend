const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const customerService = require("../Services/customer.service");
const { validationResult } = require("express-validator");
const passport=require("../config/passport.config")

module.exports.createCustomer = async (req, res) => {
  try {
    const { name, email, password, homeAddress, country, city, state, phone } =
      req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation error", error: errors.array() });
    }
    if (
      !name ||
      !email ||
      !password ||
      !homeAddress ||
      !country ||
      !city ||
      !state ||
      !phone
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isexisting = await prisma.customers.findFirst({
      where: {
        email,
      },
    });
    if (isexisting) {
      return res
        .status(400)
        .json({ message: "Already have an account on this email" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const customer = await customerService.createCustomer({
      name,
      email,
      password: hashPassword,
      homeAddress,
      country,
      city,
      state,
      phone,
    });
    return res.status(201).json({message:"Customer successfully registered" , data:customer})
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};

module.exports.loginCustomer = async (req, res, next) => {
  passport.authenticate("customer-login", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ 
          success: true, 
          message: "Customer successfully logged in", 
          user 
        });
    });
  })(req, res, next);
};

module.exports.getCustomerProfile = async (req, res) => {
  try {
    return res
      .status(200)
      .json({
        success: true,
        message: "Customer Profile Fetched Successfully",
        user: req.user,
      });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};

module.exports.getAllCustomers=async (req,res)=>{
  try{
    const {page , limit}=req.query
    const parsedPage=parseInt(page)
    const parsedLimit=parseInt(limit)
    const skip=(parsedPage-1)*limit
    const customers=await prisma.customers.findMany({
      take:parsedLimit,
      skip:skip
    })
    const total=await prisma.customers.count()
    const hasMore=total > customers.length + skip
    res.status(200).json({message:"Customers Fetched Successfully" , data:customers , total:total , hasMore:hasMore})
  }catch(e){
    console.log(e)
    return res.status(500).json({message:"Internal Server Error" , error:e.message})
  }
}

module.exports.deleteCustomer=async (req,res)=>{
  try{
    const {id}=req.query
    if(!id){
      return res.status(400).json({message:"Id is required"})
    }
    const customer=await prisma.customers.findUnique({
      where:{
        id
      }
    })
    if(!customer){
      return res.status(404).json({message:"Invalid Customer Id"})
    }
    await prisma.$transaction([
        prisma.order.deleteMany({
          where:{
            userId:id
          }
        }),
        prisma.customers.delete({
          where:{
            id
          }
        })
    ])
    return res.status(200).json({message:"Customer Deleted Successfully"})
  }catch(e){
    console.log(e)
    return res.status(500).json({message:"Internal Server Error" , error:e.message})
  }
}