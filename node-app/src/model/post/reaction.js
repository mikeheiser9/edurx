import { Schema, model } from "mongoose";

const reactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts",
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    reactionType: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const reactionModal = model("reactions", reactionSchema);
