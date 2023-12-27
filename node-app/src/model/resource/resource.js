import { Schema, Types, model } from "mongoose";
const resourceSchema = new Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    publisher: { type: String, required: true },
    isResource: { type: Boolean, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "postCategoryFilters" }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "addedAt" },
    toJSON: { virtuals: true },
  }
);

export const resourceModel = model("resource", resourceSchema);
