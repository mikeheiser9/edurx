import joi from "joi"
import { returnAppropriateError } from "../../util/commonFunctions.js"
import { forumTypes, postType } from "../../util/constant.js";
import { validateField } from "../../util/constant.js";

export const createPostValidator=async(req,res,next)=>{
        try {
            const {stringPrefixJoiValidation}= validateField
            const schema=joi.object({
                forumType:stringPrefixJoiValidation.valid(...forumTypes).required(),
                postType:stringPrefixJoiValidation.valid(...postType).required(),
                title:stringPrefixJoiValidation.required().max(200),
                text:stringPrefixJoiValidation.max(300),
                category:stringPrefixJoiValidation.required().max(200),
                tags:stringPrefixJoiValidation.max(300),
                options:joi.any().when('postType',{is:"poll",then:stringPrefixJoiValidation.required(),otherwise:stringPrefixJoiValidation.optional()}),
                isPrivate:joi.boolean()
            })
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            console.log({error});
            returnAppropriateError(res,error)            
        }
}