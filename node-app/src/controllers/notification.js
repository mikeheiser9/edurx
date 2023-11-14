import { notifications } from "../model/notification/sendNotificationTo.js";
import { getAccountSettingById } from "../repository/user.js";
import { generalResponse } from "../util/commonFunctions.js";
import { NOTIFICATION_TYPES } from "../util/constant.js";

export const getAllNotificationsOfUser = async (req, res) => {
  const pageNumber = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const skip = (pageNumber - 1) * limit;
  try {
    const userAllowedNotification = await getAccountSettingById(req.user._id);
    if (req.query.notificationType == "following") {
      const followingNotificationType = Object.values(
        NOTIFICATION_TYPES.FOLLOWING
      );
      userAllowedNotification.allowedTypes =
        userAllowedNotification.allowedTypes.filter((notificationType) => {
          return followingNotificationType.includes(notificationType);
        });
    } else if (req.query.notificationType == "my_post") {
      const myPostNotificationType = Object.values(NOTIFICATION_TYPES.MY_POST);
      userAllowedNotification.allowedTypes =
        userAllowedNotification.allowedTypes.filter((notificationType) => {
          return myPostNotificationType.includes(notificationType);
        });
    }
    const pipeline = [
      {
        $match: {
          $and: [
            {
              receiver: req.user._id,
            },
            {
              $expr: {
                $in: [
                  "$notificationType",
                  userAllowedNotification.allowedTypes,
                ],
              },
            },
            {
              isRead: false,
            },
          ],
        },
      },
      {
        $project: {
          receiver: 1,
          isRead: 1,
          eventTime: 1,
          notificationTypeId: 1,
          notificationType: 1,
          createdBy: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$createdBy" },
          pipeline: [
            {
              $match: {
                $and: [
                  { $expr: { $eq: ["$_id", "$$userId"] } },
                  { verified_account: true },
                ],
              },
            },
            {
              $project: {
                email: 1,
                _id: 1,
                username: 1,
                profile_img: 1,
              },
            },
          ],
          as: "notificationFrom",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { notificationId: "$notificationTypeId" },
          pipeline: [
            {
              $match: {
                $and: [
                  { $expr: { $eq: ["$_id", "$$notificationId"] } },
                  { isDeleted: false },
                ],
              },
            },
            {
              $project: {
                content: 1,
                postId: 1,
              },
            },
            {
              $lookup: {
                from: "posts",
                let: { postId: "$postId" },
                pipeline: [
                  {
                    $match: {
                      $and: [
                        { $expr: { $eq: ["$_id", "$$postId"] } },
                        { isDeleted: false },
                      ],
                    },
                  },
                  {
                    $project: {
                      title: 1,
                    },
                  },
                ],
                as: "postInfo",
              },
            },
          ],
          as: "commentsInfo",
        },
      },
      {
        $lookup: {
          from: "posts",
          let: { notificationId: "$notificationTypeId" },
          pipeline: [
            {
              $match: {
                $and: [
                  { $expr: { $eq: ["$_id", "$$notificationId"] } },
                  { isDeleted: false },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
              },
            },
          ],
          as: "postInfo",
        },
      },
      {
        $sort: {
          eventTime: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];
    const notificationInfo = await notifications.aggregate(pipeline);
    return generalResponse(res, 200, "success", "", notificationInfo, false);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, true);
  }
};
