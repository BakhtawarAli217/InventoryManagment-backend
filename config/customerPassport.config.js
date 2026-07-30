const Passport = require("passport").Passport;
const passport=new Passport()
const localStrategy = require("passport-local").Strategy;
const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");

passport.use(
  "customer-login",
  new localStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
        try{
      const user = await prisma.customers.findFirst({
        where: {
          email: email,
        },
      });
      if (!user) {
        return done(null, false);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false);
      }
      const { password_, ...safeUser } = user;
      return done(null, safeUser);
    }catch(e){
        return done(e)
    }
    },
  ),
);
passport.serializeUser(async (customer , done)=>{
    done(null , customer.id)
})
passport.deserializeUser(async (id , done)=>{
    try{
        const customer=await prisma.customers.findUnique({
            where:{
                id:id
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
    }catch(e){
        done(e)
    }
})

module.exports=passport