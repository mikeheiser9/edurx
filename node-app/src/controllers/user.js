import { findUserByEmail } from "../repository/user.js"
import { generalResponse } from "../util/commonFunctions.js"
export const getUserProfile=async(req,res)=>{
    try {
        const user=await findUserByEmail(req.body.email,'-password -verified_account -verification_code_expiry_time -verification_code')
        if(user)
        {
             return generalResponse(res,200,'success',null,{user},false)
        }
        else
        {
            return generalResponse(res,400,'error','something went wrong',null,true)
        }
    } catch (error) {
        return generalResponse(res,400,'error','oops...,error in fetching profile',null,true)
    }
}