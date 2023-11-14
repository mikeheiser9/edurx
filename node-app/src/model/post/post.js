import { Schema, model } from "mongoose";
import {
  forumTypes,
  postFlags,
  postStatus,
  postType,
} from "../../util/constant.js";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    postStatus: {
      type: Schema.Types.String,
      required: true,
      enum: postStatus,
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
      type: [Schema.Types.ObjectId],
      ref: "postCategoryFilters",
    },
    // tags: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "postCategoryFilters",
    // },
    filters: {
      type: [Schema.Types.ObjectId],
      ref: "postCategoryFilters",
    },
    votingLength: Number,
    isPrivate: {
      type: Boolean,
      default: false,
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
      enum: postFlags, // ["Spam", "Inappropriate", "Other"], // Example flag options
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
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

postSchema.virtual("commentCount", {
  ref: "comments",
  localField: "_id",
  foreignField: "postId",
  count: true,
  match: {
    isDeleted: false,
    parentId: null,
  },
});

postSchema.virtual("reactions", {
  ref: "reactions",
  localField: "_id",
  foreignField: "postId",
});

postSchema.virtual("likeCount", {
  ref: "reactions",
  localField: "_id",
  foreignField: "postId",
  count: true,
  match: {
    reactionType: "like",
  },
});

postSchema.virtual("dislikeCount", {
  ref: "reactions",
  localField: "_id",
  foreignField: "postId",
  count: true,
  match: {
    reactionType: "dislike",
  },
});

postSchema.virtual("views", {
  ref: "views",
  localField: "_id",
  foreignField: "itemId",
  count: true,
  match: {
    itemType: "post",
  },
});

postSchema.virtual("userAccessRequests", {
  ref: "postRequest",
  localField: "_id",
  foreignField: "postId",
});

postSchema.virtual("userAccessRequestCount", {
  ref: "postRequest",
  localField: "_id",
  foreignField: "postId",
  count: true,
});

export const postModal = model("posts", postSchema);
