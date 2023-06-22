import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    forum_type: String,
    isPoll: Boolean,
    title: String,
    text: String,
    categories: String,
    tags: String,
    isPrivate: Boolean,
    view_count: Number,
    comments_count: Number,
    publishedOn: Date,
    isDeleted: Boolean,
    flag: String,
  },
  {
    timestamps: true,
  }
);

export const postModal = model("posts", postSchema);
