import { generalResponse } from "../util/commonFunctions.js"
export const createPost=async(req,res)=>{
    try {
        if(req.files && req.files.length==0)
        {
            return generalResponse(res,400,'error','file is expected...!',null,true);
        }
        
    } catch (error) {
        return generalResponse(res,400,'error',null,null,false)
    }
}

export const doLike=async(req,res)=>{
    try {
        
    } catch (error) {
        return generalResponse(res,400,'error',null,null,false)
    }
}

export const doComment=async(req,res)=>{
    try {
        
    } catch (error) {
        return generalResponse(res,400,'error',null,null,false)
    }
}