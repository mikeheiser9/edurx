import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "users",
    },
    // repliedTo: {
    //   type: Types.ObjectId,
    //   ref: "users",
    // },
    postId: Types.ObjectId,
    taggedUsers: [
      {
        type: Types.ObjectId,
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
    parentId: {
      type: Types.ObjectId,
      ref: "comments",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

commentSchema.virtual("reactions", {
  ref: "reactions",
  localField: "_id",
  foreignField: "commentId",
});

commentSchema.virtual("likeCount", {
  ref: "reactions",
  localField: "_id",
  foreignField: "commentId",
  count: true,
  match: {
    reactionType: "like",
  },
});

commentSchema.virtual("dislikeCount", {
  ref: "reactions",
  localField: "_id",
  foreignField: "commentId",
  count: true,
  match: {
    reactionType: "dislike",
  },
});

// commentSchema.virtual("views", {
//   ref: "views",
//   localField: "_id",
//   foreignField: "itemId",
//   count: true,
//   match: {
//     itemType: "comment",
//   },
// });

commentSchema.virtual("replies", {
  ref: "comments",
  localField: "_id",
  foreignField: "parentId",
});

export const commentModal = model("comments", commentSchema);
