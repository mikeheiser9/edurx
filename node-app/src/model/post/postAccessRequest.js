import { Schema, model } from "mongoose";
import { postAccessRequestStatus } from "../../util/constant.js";

const accessRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: postAccessRequestStatus,
      required: true,
      default: postAccessRequestStatus[2],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// accessRequestSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified("status")) {
//       const currentStatus = this.status;
//       const previousStatus = this._original ? this._original.status : "pending"; // If it's a new document, assume the previous status was "pending"

//       const allowedTransitions = {
//         pending: ["accepted", "denied"],
//         accepted: [],
//         denied: [],
//       };

//       if (!allowedTransitions[previousStatus].includes(currentStatus)) {
//         throw new Error("Invalid status transition.");
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

export const postRequestModal = model("postRequest", accessRequestSchema);
