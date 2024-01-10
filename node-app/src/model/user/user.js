import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { userDocumentTypes } from "../../util/constant.js";
const userSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    email: { type: String, index: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    npi_number: String,
    npi_designation: [String],
    socials: {
      x: String,
      linkedin: String,
      instagram: String, 
      facebook: String,
      email: String,
      website: String,
    },
    personal_bio: String,
    profile_img: String,
    banner_img: String,
    verified_account: { type: Boolean, default: false },
    verification_code_expiry_time: String,
    verification_code: String,
    addresses: [String],
    city: String,
    state: String,
    zip_code: String,
    contact_email: String,
    educations: [
      {
        school_name: String,
        field_of_study: String,
        degree: String,
        start_date: Date,
        end_date: Date,
        is_in_progress: Boolean,
        activities: String,
      },
    ],
    Mentorship: { type: Boolean, default: false },
    Research: { type: Boolean, default: false },
    Collaboration: { type: Boolean, default: false },
    reading_list: [ 
      {
        type: Schema.Types.ObjectId,
        ref: 'resource'
      }
    ]
  },
  {
    timestamps: { createdAt: "joined" },
    toJSON: { virtuals: true },
    statics: {
      findByEmail(email, excludeAttributeList) {
        if (excludeAttributeList) {
          let attribute;
          if (excludeAttributeList.type == "exclude") {
            attribute = `-${excludeAttributeList.attribute.join(" -")}`;
          } else {
            attribute = excludeAttributeList.attribute.join(" ");
          }
          return this.findOne({ email: email }, attribute);
        }
        return this.findOne({ email: email });
      },
    },
  }
);
userSchema.pre("save", async function (next) {
  if (this.password) {
    this.username = `${this.first_name}_${this.last_name}_${this._id
      ?.toString()
      ?.slice(-2)}`;
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.virtual("userPosts", {
  ref: "posts",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("licenses", {
  ref: "userDocs",
  localField: "_id",
  foreignField: "userId",
  match: {
    doc_type: {
      $eq: userDocumentTypes[0],
    },
  },
});

userSchema.virtual("certificates", {
  ref: "userDocs",
  localField: "_id",
  foreignField: "userId",
  match: {
    doc_type: {
      $eq: userDocumentTypes[1],
    },
  },
});

userSchema.virtual("followingCount", {
  ref: "userConnections",
  localField: "_id",
  foreignField: "userId",
  count: true,
  match: {
    postId: undefined,
  },
});

userSchema.virtual("followersCount", {
  ref: "userConnections",
  localField: "_id",
  foreignField: "targetUserId",
  count: true,
  match: {
    postId: undefined,
  },
});

userSchema.virtual("licensesCount", {
  ref: "userDocs",
  localField: "_id",
  foreignField: "userId",
  count: true,
  match: {
    doc_type: {
      $eq: userDocumentTypes[0],
    },
  },
});

userSchema.virtual("certificatesCount", {
  ref: "userDocs",
  localField: "_id",
  foreignField: "userId",
  count: true,
  match: {
    doc_type: {
      $eq: userDocumentTypes[1],
    },
  },
});

userSchema.virtual("recentComments", {
  ref: "comments",
  localField: "_id",
  foreignField: "userId",
  limit: 10,
  options: {
    sort: {
      createdAt: -1,
    },
  },
});

userSchema.virtual("followers", {
  ref: "userConnections",
  localField: "_id",
  foreignField: "targetUserId",
});

export const userModel = model("users", userSchema);
