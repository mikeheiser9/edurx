import { Schema, Types, model } from "mongoose";

const userConnectionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    targetUserId: {
      type: Types.ObjectId, // use can follow another user
      ref: "users",
    },
    postId: {
      type: Types.ObjectId, // user can follow posts as well
      ref: "posts",
    },
  },
  {
    timestamps: true,
  }
);

export const userConnections = model("userConnections", userConnectionSchema);
