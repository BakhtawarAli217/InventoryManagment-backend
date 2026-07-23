const dotenv=require("dotenv")
dotenv.config()
const express=require("express")
const cors=require("cors")
const itemsRotues=require("./routes/items.routes")
const categoryRoutes=require("./routes/category.routes")
const brandRoutes=require("./routes/brand.routes")
const modelRoutes=require("./routes/model.routes")
const searchRoutes=require("./routes/search.routes")
const app=express()

app.use(cors({
    origin: ["http://localhost:5173" , "https://inventory-managment-software-chi.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"]
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("/items" , itemsRotues)
app.use("/category" , categoryRoutes)
app.use("/brand" , brandRoutes)
app.use("/model" , modelRoutes)
app.use("/search" , searchRoutes)


app.get("/" , (req,res)=>{
    res.send("Backend is working")
})


module.exports=app