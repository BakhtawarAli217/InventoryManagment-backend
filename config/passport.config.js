const Passport=require("passport").Passport
const passport=new Passport()
const localStrategy=require("passport-local").Strategy
const bcrypt=require("bcrypt")
const prisma=require("../prismaClient")

passport.use(new localStrategy({
    usernameField:"email"
},
async (email , password ,done)=>{
    try{
        const user=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return done(null , false , {message:"Invalid email or password"})
        }

        const match=await bcrypt.compare(password , user.password)

        if(!match){
            return done(null , false , {message:"Invalid email or password"})
        }

        const {password:_ , ...safeUser}=user
        return done(null , safeUser)
    }catch(e){
        return done(e)
    }
}
))

passport.serializeUser(async (user , done)=>{
    done(null , user.id)
})

passport.deserializeUser(async (id , done)=>{
    try{
        const user=await prisma.user.findUnique({
            where:{
                id
            },
            select:{
                name:true,
                id:true,
                email:true,
                createdAt:true,
                updatedAt:true
            }
        }) 
        done(null , user)
    }catch(e){
        done(e)
    }
})

module.exports=passport