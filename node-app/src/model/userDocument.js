import { model, Schema } from "mongoose";
import { userDocumentTypes } from "../util/constant.js";

const documentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    doc_type: {
      type: Schema.Types.String,
      enum: userDocumentTypes,
      required: true,
    },
    doc_name: {
      type: Schema.Types.String,
      required: true,
    },
    doc_id: {
      type: Schema.Types.String,
      uppercase: true,
    },
    issuer_organization: {
      type: Schema.Types.String,
      required: true,
    },
    doc_image: Schema.Types.String,
    doc_url: Schema.Types.String,
    issue_date: Schema.Types.Date,
    expiration_date: Schema.Types.Date,
    has_no_expiry: Schema.Types.Boolean,
  },
  {
    timestamps: true,
  }
);

export const userDocumentModal = model("userDocs", documentSchema);
