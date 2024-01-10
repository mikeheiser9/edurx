import { model, Schema } from "mongoose";
import { NOTIFICATION_TYPES } from "../../util/constant.js";

const settingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    allowedTypes: [
      {
        type: Schema.Types.String,
        enum: Object.values(NOTIFICATION_TYPES.All),
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const accountSettingModal = model("accountSettings", settingsSchema);
