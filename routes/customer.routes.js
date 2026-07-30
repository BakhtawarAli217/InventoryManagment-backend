const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const { body } = require("express-validator");
const customerAuthMiddleware = require("../middlewares/customerAuth.middleware");

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid Email Address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
  body("homeAddress").notEmpty().withMessage("Home address is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  customerController.createCustomer
);

router.post("/login", customerController.loginCustomer);

router.get("/profile", customerAuthMiddleware.authCustomer, customerController.getCustomerProfile);

module.exports = router;