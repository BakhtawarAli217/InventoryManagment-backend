const resend=require("../config/resend.config")


module.exports.sendEmail=async ({to , subject , html})=>{
    try{
        const response=await resend.emails.send({
            from:"Logistic-Hub <onboarding@resend.dev>",
            to,
            subject,
            html
        })
        console.log(response)
    }catch(e){
        throw new Error(e)
    }
}