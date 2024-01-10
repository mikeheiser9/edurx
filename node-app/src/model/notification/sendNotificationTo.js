import { Schema, model } from "mongoose";
import { NOTIFICATION_TYPES } from "../../util/constant.js";

const notification = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  notificationType: {
    type: Schema.Types.String,
    enum: Object.values(NOTIFICATION_TYPES.All),
  },
  notificationTypeId: Schema.Types.ObjectId,
  isRead: Schema.Types.Boolean,
  eventTime: {
    type: Schema.Types.Date,
  },
  remindMeTomorrow: {
    type: Schema.Types.Date,
  },
  dismiss: Schema.Types.Boolean,
});
export const notifications = model("notifications", notification);
