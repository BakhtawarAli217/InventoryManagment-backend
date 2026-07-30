const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const customerService = require("../Services/customer.service");
const { validationResult } = require("express-validator");
const passport=require("../config/customerPassport.config")

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