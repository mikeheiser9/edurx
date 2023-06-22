import mongoose, { model, Schema } from "mongoose";

const certificateSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cert_title: String,
    issuing_organization: String,
    date_issued: Date,
    exp_date: Date,
    lice_id: String,
    verified_lice: Boolean,
  },
  {
    timestamps: true,
  }
);

export const certificateModal = model("certificates", certificateSchema);
