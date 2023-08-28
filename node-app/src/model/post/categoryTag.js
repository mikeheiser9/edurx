import { Schema, model } from "mongoose";
import { postCategoryTagsTypes } from "../../util/constant.js";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: postCategoryTagsTypes,
      required: true,
    },
    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "user",
    // },
    isDeleted: Boolean,
  },
  {
    timestamps: true,
  }
);

export const categoryTagModal = model("postCategoryTags", schema);
