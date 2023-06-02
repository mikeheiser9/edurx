import passport from "passport";
import * as JStrategy from "passport-jwt"
import { findUserByEmail } from "../../repository/user.js";
const JWTStrategy=JStrategy.Strategy
const ExtractJWT=JStrategy.ExtractJwt;
const opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey:process.env.JWT_SECRET || "my_jwt_secret"
}
passport.use('jwt',new JWTStrategy(opts,async(payload,done)=>{
    try {
        const user=await findUserByEmail(payload.email);    
        user ? done(null,user) : done(null,false)
    } catch (error) {
        done(error)
    }
})) 