import passport from "passport"
import { generalResponse } from "../../util/commonFunctions.js"
export const userAuth=(req,res,next)=>{
    passport.authenticate('jwt',(error,user)=>{
        if(error)
        {
            return next(error)
        }
        if(!user)
        {
            return generalResponse(res,403,'error','your token is expired',null,false);
        }
        else
        {
            if(!user.verified_account)
            {
                return generalResponse(res,403,'error','verify your email first..!',null,false);
            }
            req.user=user;
            next()
        }
    })(req,res,next)
}
