const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");
const passport=require("../config/passport.config")
const authMiddleWare=require("../middlewares/userAuth.middleware")

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid Email Address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password Must be atleast 8 characters long"),
    body("name").isLength({min:3}).withMessage("userName must be at least 3 characters long"),
  userController.registerUser,
);
router.post("/login" , userController.loginUser )
router.get("/profile" , authMiddleWare.authUser , userController.profile)
router.post("/Generate-Reset-Token" , userController.GenerateResetToken)

module.exports = router;
