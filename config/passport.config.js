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
        safeUser.type = "user"
        return done(null , safeUser)
    }catch(e){
        return done(e)
    }
}
))

passport.use(
  "customer-login",
  new localStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const customer = await prisma.customers.findFirst({
          where: {
            email: email,
          },
        });
        if (!customer) {
          return done(null, false, { message: "Invalid email or password" });
        }
        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
          return done(null, false, { message: "Invalid email or password" });
        }
        const { password: _, ...safeCustomer } = customer;
        safeCustomer.type = "customer";
        return done(null, safeCustomer);
      } catch (e) {
        return done(e);
      }
    },
  ),
);

passport.serializeUser(async (user , done)=>{
    done(null , { id: user.id, type: user.type || "user" })
})

passport.deserializeUser(async (sessionUser , done)=>{
    try{
        if(!sessionUser){
            return done(null, false)
        }

        if(sessionUser.type === "customer"){
            const customer=await prisma.customers.findUnique({
                where:{
                    id: sessionUser.id
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                    homeAddress:true,
                    Country:true,
                    City:true,
                    State:true,
                    phone:true
                }
            })
            return done(null , customer)
        }

        const user=await prisma.user.findUnique({
            where:{
                id: sessionUser.id
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