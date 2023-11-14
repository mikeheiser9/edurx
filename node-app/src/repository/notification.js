import { notifications } from "../model/notification/sendNotificationTo.js";

export const insertNotification = async ({
  type,
  sourceId,
  destinationId,
  contentId,
  eventTime,
}) => {
  if (type == "user_followed_you") {
    await new notifications({
      createdBy: sourceId,
      notificationType: type,
      receiver: destinationId,
      isRead: false,
      eventTime,
    }).save();
    return;
  } else if (
    [
      "user_replied_to_your_comment",
      "user_comments_on_your_post",
      "user_requested_to_follow_your_private_post",
    ].includes(type)
  ) {
    await new notifications({
      createdBy: sourceId,
      notificationType: type,
      notificationTypeId: contentId,
      receiver: destinationId,
      isRead: false,
      eventTime,
    }).save();
    return;
  } else if (
    [
      "user_you_follow_published_a_new_post",
      "user_who_you_follow_commented_on_a_post",
      "user_approved_your_request_to_follow_a_private_post",
    ].includes(type)
  ) {
    const eventTime = new Date();
    const eventsReceiver = destinationId.map((destination) => {
      return {
        createdBy: sourceId,
        notificationType: type,
        notificationTypeId: contentId,
        receiver: destination,
        isRead: false,
        eventTime: eventTime,
      };
    });
    await notifications.insertMany(eventsReceiver);
    return;
  }
};
