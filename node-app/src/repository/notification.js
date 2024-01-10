import { notifications } from "../model/notification/sendNotificationTo.js";

export const insertNotification = async ({
  type,
  sourceId,
  destinationId,
  contentId,
  eventTime,
  multipleInsert=false,
  whatIsMultiple=null,
}) => {
  if (multipleInsert) {
    let insertingData;
    if (whatIsMultiple == "sourceId") {
      insertingData = sourceId.map((sourceId) => {
        return {
          createdBy: sourceId,
          notificationType: type,
          notificationTypeId: contentId,
          receiver: destinationId,
          isRead: false,
          eventTime: eventTime,
        };
      });
    } else if (whatIsMultiple == "destinationId") {
      insertingData = destinationId.map((destination) => {
        return {
          createdBy: sourceId,
          notificationType: type,
          notificationTypeId: contentId,
          receiver: destination,
          isRead: false,
          eventTime: eventTime,
        };
      });
    }
    await notifications.insertMany(insertingData);
  } else {
    await new notifications({
      createdBy: sourceId,
      notificationType: type,
      notificationTypeId: contentId,
      receiver: destinationId,
      isRead: false,
      eventTime,
    }).save();
  }
};

export const findNotificationByCondition = async (condition) => {
  return await notifications.findOne(condition);
};

export const deleteNotificationByCondition=async(condition)=>{
  return notifications.deleteOne(condition)
}

export const findAndUpdateNotificationByCondition=async(condition,dateToUpdate)=>{
  return notifications.findOneAndUpdate(condition,dateToUpdate)
}