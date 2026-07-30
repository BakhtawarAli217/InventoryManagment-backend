const prisma=require("../prismaClient")


module.exports.createCustomer=async ({name , email , password , homeAddress , city , country , state , phone})=>{
    try{
        const customer=await prisma.customers.create({
            data:{
                name,
                email,
                password,
                homeAddress,
                Country:country,
                City:city,
                State:state,
                phone
            }
        })
        return customer;
    }catch(e){
        throw new Error(e.message)
    }
}