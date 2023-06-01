import {Router} from "express";
import { userAuth } from "../middleware/passport/userAuth.js";
import { getUserProfile } from "../controllers/user.js";
const userRoute=Router();
userRoute.get("/profile",userAuth,getUserProfile)
export default userRoute;
