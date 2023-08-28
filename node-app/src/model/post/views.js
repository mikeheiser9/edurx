import { Schema, model } from "mongoose";

const viewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    itemType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const viewModal = model("views", viewSchema);
