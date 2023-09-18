import { Schema, Types, model } from "mongoose";

const userConnectionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    targetUserId: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const userConnections = model("userConnections", userConnectionSchema);
