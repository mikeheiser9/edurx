import {Router} from "express"
import { userAuth } from "../middleware/passport/userAuth.js";
import { getAllNotificationsOfUser } from "../controllers/notification.js";
const notificationRoute=Router()
notificationRoute.get("/user/all",userAuth,getAllNotificationsOfUser)
export default notificationRoute;