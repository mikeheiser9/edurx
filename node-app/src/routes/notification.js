import {Router} from "express"
import { userAuth } from "../middleware/passport/userAuth.js";
import { getAllNotificationsOfUser, userTimeSensitiveNotification } from "../controllers/notification.js";
const notificationRoute=Router()
notificationRoute.get("/user/all",userAuth,getAllNotificationsOfUser)
notificationRoute.get("/user/time-sensitive-notification",userAuth,userTimeSensitiveNotification)
export default notificationRoute;