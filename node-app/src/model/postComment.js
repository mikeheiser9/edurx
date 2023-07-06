import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
      index: true,
    },
    // will be converted to sperate schema to maintain like dislike for post and comments both in the same
    // likeDislikes: [likeDislikes],
    taggedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    // replies: {
    //   type: [commentSchema],
    //   default: [],
    // },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "comments",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.virtual("reactions", {
  ref: "reactions",
  localField: "_id",
  foreignField: "targetId",
});

export const commentModal = model("comments", commentSchema);
