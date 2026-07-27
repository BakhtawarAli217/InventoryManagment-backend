const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const passport = require("../config/passport.config");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../Services/mail.service");
const resetTemplete = require("../templates/reset.template");

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "validation error", error: errors.array() });
    }
    if (!email || !name || !password) {
      return res.status(404).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters long" });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        email: true,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "Already have an account registered with this email",
        });
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hasedPassword,
      },
    });

    await new Promise((resolve , reject)=>{
         req.login(user , (err)=>{
      if(err){
        reject(err)
      }
      resolve()
    })
    })
    
    return res.status(201).json({ message: "User successfully registered" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};

module.exports.loginUser = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ success: true, message: "User successfully logged in", user });
    });
  })(req, res, next);
};

module.exports.profile = async (req, res) => {
  try {
    return res
      .status(200)
      .json({
        success: true,
        message: "Profile Fetched Successfully",
        user: req.user,
      });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};
module.exports.GenerateResetToken = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({ message: "Email is Required" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRETE, {
      expiresIn: "10m",
    });
    await sendEmail({
      to: email,
      subject: "Reset Your Logistic-Hub Password",
      html: resetTemplete(token),
    });
    return res.status(200).json({message:"An email is send to your email"})
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};
module.exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Valid token",
      success:true
    });

  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired"
      });
    }

    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message
    });
  }
};
module.exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    const isBlackListed=await prisma.blackListedToken.findFirst({
      where:{
        token
      }
    })
    if(isBlackListed){
      return res.status(400).json({message:"Invalid Token"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const id = decoded.id;

    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id
      },
      data: {
        password: hashPassword
      }
    });

    await prisma.blackListedToken.create({
      data:{
        token
      }
    })

    return res.status(200).json({
      message: "Password has been changed successfully"
    });

  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired"
      });
    }

    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message
    });
  }
};