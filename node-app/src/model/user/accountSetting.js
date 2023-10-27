import { model, Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    notification: {
      allowedTypes: [
        {
          type: Schema.Types.String,
          enum: Object.values(NOTIFICATION_TYPES),
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const accountSettingModal = model("accountSettings", settingsSchema);
