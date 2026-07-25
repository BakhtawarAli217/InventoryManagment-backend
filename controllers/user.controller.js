const prisma=require("../prismaClient")
const bcrypt=require("bcrypt")
const {validationResult}=require("express-validator")
const passport=require("../config/passport.config")

module.exports.registerUser=async (req,res)=>{
    try{
        const {name , email , password}=req.body
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:"validation error" , error:errors.array()})
        }
        if(!email || !name || !password){
            return res.status(404).json({message:"All fields are required"})
        }
        if(password.length<8){
            return res.status(400).json({message:"Password must be atleast 8 characters long"})
        }
        const existingUser=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(existingUser){
            return res.status(400).json({message:"Already have an account registered with this email"})
        }
        const hasedPassword=await bcrypt.hash(password , 10)
        const user=await prisma.user.create({
            data:{
                name,
                email,
                password:hasedPassword
            }
        })
        return res.status(201).json({message:"User successfully registered"})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}

module.exports.loginUser=async (req,res,next)=>{
    passport.authenticate("local" , (err , user , info)=>{
        if(err){
            return next(err)
        }
        if(!user){
            return res.status(401).json({success:false , message:info.message})
        }
        req.login(user , (err)=>{
            if(err){
                return next(err)
            }
            return res.status(200).json({success:true , message:"User successfully logged in" , user})
        })

    })(req,res,next)
}