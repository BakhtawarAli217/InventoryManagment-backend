const prisma=require("../prismaClient")
const {createModel}=require("../Services/model.service")

module.exports.CreateModel=async (req,res)=>{
    try{
        const {name , brandId}=req.body
        if(!name || !brandId){
            return res.status(404).json({message:"All fields are required"})
        }
        const isBrand=await prisma.brand.findUnique({
            where:{
                id:brandId
            }
        })
        if(!isBrand){
            return res.status(404).json({message:"Invalid Brand"})
        }
        const isExist=await prisma.brandModel.findFirst({
            where:{
                name:name,
                brandId:brandId
            }
        })
        if(isExist){
            return res.status(400).json({message:"A model with this name is already registered"})
        }
        const model=await createModel({name , brandId})
        return res.status(201).json({message:"Model Created Successfully" , data:model})

    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}
module.exports.getModelByBrand=async (req,res)=>{
    try{
        const {id , page , limit}=req.query
        if(!id){
            return res.status(404).json({message:"Brand Id is required"})
        }
        const isBrand=await prisma.brand.findUnique({
            where:{
                id:id
            }
        })
        if(!isBrand){
            return res.status(404).json({message:"Invalid Brand Id"})
        }
        const parsedPage=page ? parseInt(page) : 1
        const parsedlimit=limit ? parseInt(limit) : 10
        const skip=(parsedPage-1) * parsedlimit;
        const models=await prisma.brandModel.findMany({
            where:{
                brandId:id
            },
            skip:skip,
            take:parsedlimit
        })
        const total=await prisma.brandModel.count({
            where:{
                brandId:id
            }
        })
        const hasMore=models.length + skip < total
        return res.status(200).json({message:"Models Fetched Successfully" , data:models , hasMore:hasMore})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}

module.exports.getAllModels=async (req,res)=>{
    try{
        const {page , limit}=req.query
        const parsedPage=parseInt(page)
        const parsedLimit=parseInt(limit)
        const skip=(parsedPage-1)*parsedLimit
        const models=await prisma.brandModel.findMany({
            skip:skip,
            take:parsedLimit
        })
        const total=await prisma.brandModel.count()
        const hasMore=models.length + skip < total
        return res.status(201).json({message:"Brand Models are fetched successfully" , data:models , hasMore:hasMore , total:total})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error"})
    }
}
module.exports.deleteModel=async (req,res)=>{
    try{
        const {id}=req.params
        if(!id){
            return res.status(404).json({message:"Model Id is required"})
        }
        const isModelExist=await prisma.brandModel.findUnique({
            where:{
                id:id
            }
        })
        if(!isModelExist){
            return res.status(404).json({message:"Invalid Model Id"})
        }
        await prisma.item.deleteMany({
            where:{
                itemModelId:id
            }
        })
        const deletedModel=await prisma.brandModel.delete({
            where:{
                id:id
            }
        })
        return res.status(200).json({message:"Model Deleted Successfully" , data:deletedModel})
    }catch(e){
        return res.status(500).json({message:"Internal Server Error" , error:e.message})
    }
}