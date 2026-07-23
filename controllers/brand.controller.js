const prisma=require("../prismaClient")
const brandServices=require("../Services/brand.service")


module.exports.uploadBrand=async (req,res)=>{
    try{
        const {name , categoryId}=req.body
        if(!name){
            return res.status(404).json({message:"Name is required"})
        }
        if(!categoryId){
            return res.status(404).json({message:"Category Id is required"})
        }
        const isexist=await prisma.category.findUnique({
            where:{
                id:categoryId
            }
        })
        if(!isexist){
            return res.status(404).json({message:"Invalid Category Id"})
        }
        const normalizedName=name.toLowerCase().trim()

        const isexsit=await prisma.brand.findUnique({
            where:{
                name:normalizedName,
                categoryId:categoryId
            }
        })
        if(isexsit){
            return res.status(400).json({message:"Already registered"})
        }
        const brand=await brandServices.createBrand({name , categoryId})
        return res.status(201).json({message:"Brand Successfully created" , data:brand})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}

module.exports.getAllBrands=async (req,res)=>{
    try{
        const {page , limit}=req.query
        const parsedPage=page ? parseInt(page) : 1
        const parsedlimit=limit ? parseInt(limit) : 10
        const skip=(parsedPage-1) * parsedlimit;
        const brands=await prisma.brand.findMany({
            skip:skip,
            take:parsedlimit,
            orderBy:{
                createdAt:"desc"
            }
        })
        const total=await prisma.brand.count()
        const hasMore=brands.length + skip < total
        return res.status(200).json({message:"Brands Fetched Successfully" , data:brands , hasMore:hasMore , total:total})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}

module.exports.getBrandByCategory=async (req,res)=>{
    try{
        const {id , page , limit}=req.query
        const parsedPage=page ? parseInt(page) : 1
        const parsedlimit=limit ? parseInt(limit) : 10
        const skip=(parsedPage-1) * parsedlimit;
        if(!id){
            return res.status(404).json({message:"Category Id is required"})
        }
        const isCatExist=await prisma.category.findUnique({
            where:{
                id
            }
        })
        if(!isCatExist){
            return res.status(404).json({message:"Invalid Category Id"})
        }
        const brands=await prisma.brand.findMany({
            where:{
                categoryId:id
            },
            skip:skip,
            take:parsedlimit
        })
        const total=await prisma.brand.count({
            where:{
                categoryId:id
            }
        })
        const hasMore=brands.length + skip < total
        return res.status(200).json({message:"Brands Fetched Successfully" , data:brands , hasMore:hasMore})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}

module.exports.deleteBrand=async (req,res)=>{
    try{
        const {id}=req.params
        if(!id){
            return res.status(404).json({message:"Brand Id is required"})
        }
        const isBrandExist=await prisma.brand.findUnique({
            where:{
                id:id
            }
        })
        if(!isBrandExist){
            return res.status(404).json({message:"Invalid Brand Id"})
        }
        const deletedBrand=await prisma.brand.delete({
            where:{
                id:id
            }
        })
        return res.status(200).json({message:"Brand deleted successfully" , data:deletedBrand})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}