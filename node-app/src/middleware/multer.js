import  multer from "multer"
import { allowFileType } from "../util/constant.js"
import { generalResponse } from "../util/commonFunctions.js"
import path from "path"
export const fileTypeCheckAndRename=(req,res,next)=>{
    if(req.files)
    {
        if(req.files.every(file=>allowFileType.includes(file.mimetype)))
        {
            req.files=req.files.map((file)=>{
                return {
                    ...file,
                    "renamedFile":`${file.fieldname}_${new Date().getTime()}_${path.extname(file.originalname)}`
                }
            })
            next()
        }
        else
        {
            return generalResponse(res,400,'error','unsupported file...!',null,true)
        }
    }
    else
    {
        next();
    }
}
export const fileUpload=multer({
    storage:multer.memoryStorage()
}).any()