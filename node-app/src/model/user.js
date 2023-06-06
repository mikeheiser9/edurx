import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    email: { type: String, index: true ,required:true},
    password: {type:String,required:true },
    role: {type:String,required:true},
    npi_number: String,
    npi_designation: [String],
    socials: {
      twitter: String,
      linkedin: String,
      instagram: String,
      facebook: String,
      email: String,
    },
    about: String,
    profile_img: String,
    banner_img: String,
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    verified_account: { type: Boolean, default: false },
    verification_code_expiry_time: String,
    verification_code: String,
    addresses: [String],
    city: String,
    state: String,
    zip_code: String,
    // will store the last two certificate uploaded by the user
    certifications: [
      {
        certifications_id: {
          type: mongoose.Types.ObjectId,
          ref: "certification",
        },
        cert_title: String,
        issuing_organization:String,
        date_issued: Date,
        exp_date: Date,
        lice_id: String,
        verified_lice: Boolean,
      },
    ],  
    // last two uploaded licenses
    licenses: [
      {
        license_id: { type: mongoose.Types.ObjectId, ref: "licenses" },
        lice_title: String,
        date_issued: Date,
        exp_date: Date,
        lice_id: String,
        verified_lice: Boolean,
      },
    ],
    // last two education
    Education: [
      {
        education_id: { type: mongoose.Types.ObjectId, ref: "education" },
        name: String,
        year_start: Date,
        year_end: Date,
        degree: Date,
      },
    ],
    // will store last six post in this object
    post: [
      {
        post_id: { type: mongoose.Types.ObjectId, ref: "post" },
        user_id: {type:mongoose.Types.ObjectId,ref:"user"},
        forum_type: String,
        isPoll: Boolean,
        title: String,
        text: String,
        categories: String,
        tags: String,
        isPrivate: Boolean,
        view_count: Number,
        comments_count: Number,
        publishedOn:Date,
        isDeleted:Boolean,
        flag:String
      },
    ],
  },
  {
    timestamps: { createdAt: "joined" },
    statics: {
      findByEmail(email,excludeAttributeList) {
        return this.findOne({ email: email },excludeAttributeList);
      },
    },
  }
);
userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
export const userModel = model("users", userSchema);
