const dotenv=require("dotenv")
dotenv.config()
const express=require("express")
const cors=require("cors")
const itemsRotues=require("./routes/items.routes")
const categoryRoutes=require("./routes/category.routes")
const brandRoutes=require("./routes/brand.routes")
const modelRoutes=require("./routes/model.routes")
const searchRoutes=require("./routes/search.routes")
const userRoutes=require("./routes/user.routes")
const passport=require("./config/passport.config")
const paymentRoutes=require("./routes/payment.routes")
const subscriptionRoutes=require("./routes/subscription.routes")
const session=require("express-session")
const app=express()

const isProduction = process.env.NODE_ENV === "production";
app.set("trust proxy",1);
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:3000" , "https://inventory-managment-software-chi.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials:true,
    allowedHeaders: ["Content-Type"]
}))
app.use(express.urlencoded({extended:true}))
app.use(
    "/api/payment/webhook",
    express.raw({type:"application/json"})
)

app.use(express.json())
app.use(session({
    secret:process.env.SESSION_SECRETE,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:30 * 24 * 60 * 60 * 1000,
        httpOnly:true,
         secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use("/items" , itemsRotues)
app.use("/category" , categoryRoutes)
app.use("/brand" , brandRoutes)
app.use("/model" , modelRoutes)
app.use("/search" , searchRoutes)
app.use("/user" , userRoutes)
app.use("/api/payment" , paymentRoutes)
app.use("/subscriptions" , subscriptionRoutes)

app.get("/" , (req,res)=>{
    res.send("Backend is working")
})


module.exports=app