const prisma=require("../prismaClient")

module.exports.createModel=async ({name , brandId})=>{
    try{
        const model=await prisma.brandModel.create({
            data:{
                name,
                brandId
            }
        })
        return model
    }catch(e){
        throw new Error(e.message)
    }
}