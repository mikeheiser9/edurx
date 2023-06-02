
export const extractError=(errors)=>{
   if(errors.details)
   {
    return errors.details.map((error)=>error.message).join(", ")
   } 
   return false;
}

export const generalResponse=(res,statusCode,response_type,message,data,toast)=>{
   res.status(statusCode).send({
      data,
      message,
      response_type,
      toast
   })
}

export const generateRandomAlphanumericCharacterOfLengthTillTenDigit=(length)=>{
   return Math.random().toString(36).substring(2,length+2);
}

export const prepareMail=(to,subject,text,html)=>{
   return  {
      to,
      from : process.env.MAIL_FROM_ADDRESS,
      subject,
      text,
      html
   }
}

export const prepareVerificationCodeForEmailConfirmation=(fullName,email)=>{
        const currentTime=new Date().getTime();
        const codeExpireTime=currentTime+(1000*60*5)
        const randomCode=generateRandomAlphanumericCharacterOfLengthTillTenDigit(7);
        const html=`<label>Hii ${fullName}</label><br><br>Here is Your EduRx email confirmation code&nbsp;<b>${randomCode}<br><br>EduRx Team</b>`
        const mail= prepareMail(email,'code for confirmation of your email for registration','email confirmation code',html)
        return {mail,codeExpireTime,randomCode}
}

export const trimFields=(fields)=>{
   for(let key in fields)
   {
      if(key!="password" &&  typeof fields[key]=="string")
      {
         fields[key]=fields[key].trim();
      }
   }
   return fields
}

export const returnAppropriateError=(res,error)=>{
   const isError=extractError(error)
   if(isError=="false")
   {
       return generalResponse(res,400,'error',null,null,true)
   }
   return generalResponse(res,400,'error',isError,null,true)
}