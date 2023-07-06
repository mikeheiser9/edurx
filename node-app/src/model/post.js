import { Schema, model } from "mongoose";
import { forumTypes, postType } from "../util/constant.js";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    forumType: {
      type: Schema.Types.String,
      enum: forumTypes,
      required: true,
    },
    postType: {
      type: Schema.Types.String,
      enum: postType,
      required: true,
    },
    title: {
      type: Schema.Types.String,
      required: true,
    },
    content: String,
    categories: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    publishedOn: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    flag: {
      type: String,
      enum: ["Spam", "Inappropriate", "Other"], // Example flag options
    },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    // },
    // toObject: {
    //   virtuals: true,
    // },
  }
);

postSchema.virtual("comments", {
  ref: "comments",
  localField: "_id",
  foreignField: "postId",
});

postSchema.virtual("reactions", {
  ref: "reactions",
  localField: "_id",
  foreignField: "targetId",
});

export const postModal = model("posts", postSchema);
