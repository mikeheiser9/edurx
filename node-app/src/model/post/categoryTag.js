import { Schema, model } from "mongoose";
import { forumTypes, postCategoryFilterTypes } from "../../util/constant.js";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: postCategoryFilterTypes,
      required: true,
    },
    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "user",
    // },
    isDeleted: Boolean,
    forumType: {
      type: Schema.Types.String,
      enum: forumTypes,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const categoryFilterModal = model("postCategoryFilters", schema);
