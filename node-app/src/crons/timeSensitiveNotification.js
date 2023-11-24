import cron from "node-cron";
import { userDocumentModal } from "../model/user/document.js";
import { notifications } from "../model/notification/sendNotificationTo.js";
import { NOTIFICATION_TYPES } from "../util/constant.js";
// 0 0 0 * * * run at 12:00 AM on everyday
cron.schedule("* * * * *", async () => {
  console.log(`running the cron job at : ${new Date()} `);
  try {
    let notificationIds = await notifications
      .find({
        notificationType: NOTIFICATION_TYPES.TIME_SENSITIVE_NOTIFICATION,
      })
      .select({ notificationTypeId: 1, _id: 0, notificationType: 1 });
    notificationIds = notificationIds?.map((notification) => {
      return notification.notificationTypeId;
    });
    const currentTime = new Date();
    const userDocs = await userDocumentModal.aggregate([
      {
        $match: {
          $and: [
            {
              _id: { $nin: notificationIds },
            },
            {
              has_no_expiry: false,
            },
            {
              expiration_date: {
                $lte: new Date(currentTime.setDate(currentTime.getDate() + 30)),
              },
            },
          ],
        },
      },
      {
        $project: {
          userId: 1,
          _id: 1,
        },
      },
    ]);
    if (userDocs && userDocs.length > 0) {
      const timeSensitiveNotificationData = userDocs.map((docs) => {
        return {
          receiver: docs.userId,
          notificationType: NOTIFICATION_TYPES.TIME_SENSITIVE_NOTIFICATION,
          notificationTypeId: docs._id,
          remindMeTomorrow: "",
          dismiss: false,
          isRead: false,
        };
      });
      await notifications.insertMany(timeSensitiveNotificationData);
    }
  } catch (error) {
    console.log("error ocurred during the cron job running", error);
  }
});
