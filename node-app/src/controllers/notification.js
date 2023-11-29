import { notifications } from "../model/notification/sendNotificationTo.js";
import { findAndUpdateNotificationByCondition } from "../repository/notification.js";
import { getAccountSettingById } from "../repository/user.js";
import { generalResponse } from "../util/commonFunctions.js";
import { NOTIFICATION_TYPES } from "../util/constant.js";

export const getAllNotificationsOfUser = async (req, res) => {
  let { notificationType, isNew, eventTime, page, limit } = req.query;
  const pageNumber = page ? page : 1;
  limit = limit ? Number(limit) : 10;
  const skip = (pageNumber - 1) * limit;
  try {
    const userAllowedNotification = await getAccountSettingById(req.user._id);
    if (notificationType == "following") {
      const followingNotificationType = Object.values(
        NOTIFICATION_TYPES.FOLLOWING
      );
      userAllowedNotification.allowedTypes =
        userAllowedNotification.allowedTypes.filter((notificationType) => {
          return followingNotificationType.includes(notificationType);
        });
    } else if (notificationType == "my_post") {
      const myPostNotificationType = Object.values(NOTIFICATION_TYPES.MY_POST);
      userAllowedNotification.allowedTypes =
        userAllowedNotification.allowedTypes.filter((notificationType) => {
          return myPostNotificationType.includes(notificationType);
        });
    }
    const commentRelatedNotification =
      userAllowedNotification?.allowedTypes?.filter(
        (notificationType) => notificationType.search("comment") != -1
      );
    const postRelatedNotification =
      userAllowedNotification?.allowedTypes?.filter(
        (notificationType) =>
          notificationType.search("post") != -1 &&
          !commentRelatedNotification.includes(notificationType)
      );
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
            JSON.parse(isNew)
              ? { eventTime: { $gt: new Date(Number(eventTime)) } }
              : { eventTime: { $lte: new Date(Number(eventTime)) } },
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
          let: {
            notificationId: "$notificationTypeId",
            notificationType: "$notificationType",
          },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $in: ["$$notificationType", commentRelatedNotification],
                    },
                  },
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
          let: {
            notificationId: "$notificationTypeId",
            notificationType: "$notificationType",
          },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $in: ["$$notificationType", postRelatedNotification],
                    },
                  },
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

export const userTimeSensitiveNotification = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = (page - 1) * limit;
    const timeSensitiveNotification = await notifications.aggregate([
      {
        $match: {
          $and: [
            {
              notificationType: "time_sensitive_notifications",
            },
            {
              receiver: req.user._id,
            },
            {
              dismiss: false,
            },
            {
              $or: [
                {
                  remindMeTomorrow: {
                    $lte: new Date(),
                  },
                },
                {
                  remindMeTomorrow: null,
                },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          receiver: 1,
          notificationType: 1,
          notificationTypeId: 1,
          isRead: 1,
          remindMeTomorrow: 1,
          dismiss: 1,
        },
      },
      {
        $lookup: {
          from: "userdocs",
          let: { notificationId: "$notificationTypeId" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$_id", "$$notificationId"] } },
            },
            {
              $project: {
                _id: 1,
                doc_name: 1,
                doc_type: 1,
                doc_url: 1,
                expiration_date: 1,
              },
            },
          ],
          as: "documentInfo",
        },
      },
      {
        $unwind: "$documentInfo",
      },
      {
        $sort: { "documentInfo.expiration_date": 1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    return generalResponse(
      res,
      200,
      "success",
      "",
      timeSensitiveNotification,
      false
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, true);
  }
};

export const notificationAction = async (req, res) => {
  try {
    let updateObject={};
    if (req.url.split("/")[2] == "dismiss") {
      updateObject = {
        dismiss: true,
      };
    } else {
      let nextDay = new Date();
      nextDay.setUTCHours(24, 0, 0, 0);
      updateObject = {
        remindMeTomorrow: nextDay,
      };
    }
    const rowAffected = await findAndUpdateNotificationByCondition(
      {
        notificationType: "time_sensitive_notifications",
        _id: req.params.notificationId,
        receiver: req.user._id,
      },
      updateObject
    );
    if (!rowAffected) {
      throw new Error("unAuthorized action detected...");
    }
    return generalResponse(
      res,
      200,
      "success",
      "notification dismiss successfully",
      "",
      true
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, true);
  }
};
