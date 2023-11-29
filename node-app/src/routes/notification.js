import { Router } from "express";
import { userAuth } from "../middleware/passport/userAuth.js";
import {
  notificationAction,
  getAllNotificationsOfUser,
  userTimeSensitiveNotification,
} from "../controllers/notification.js";
import { dismissAndRemindMeTomorrowNotificationValidator } from "../middleware/validator/notification.js";
const notificationRoute = Router();
notificationRoute.get("/user/all", userAuth, getAllNotificationsOfUser);
notificationRoute.get(
  "/time-sensitive",
  userAuth,
  userTimeSensitiveNotification
);
notificationRoute.put(
  "/time-sensitive/dismiss/:notificationId",
  userAuth,
  dismissAndRemindMeTomorrowNotificationValidator,
  notificationAction
);
notificationRoute.put(
  "/time-sensitive/remindMeTomorrow/:notificationId",
  userAuth,
  dismissAndRemindMeTomorrowNotificationValidator,
  notificationAction
);
export default notificationRoute;
