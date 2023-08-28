import joi from "joi";
import { joiObjectIdValidator } from "./commonFunctions.js";

export const validateField = {
  email: joi.string().trim().required().email().max(150),
  password: joi.string().required(),
  stringPrefixJoiValidation: joi.string().trim(),
  objectId: joi.string().custom(joiObjectIdValidator, "Invalid Object ID"),
};

export const roles = ["super_admin", "moderator", "professional", "student"];
export const userDocumentTypes = ["license", "certificate"];

export const forumTypes = [
  "Dietetics & Nutrition",
  "Medical professionals",
  "RDN",
  "NDTR",
  "Student",
];

export const postType = ["post", "poll"];
export const postStatus = ["draft", "published"];
export const postCategoryTagsTypes = ["tag", "category"];

export const allowFileType = [
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/png",
];

export const taxonomyCodeToProfessionalMapping = {
  "133V00000X": "RDN",
  "136A00000X": "NDTR",
};

export const spreadsheetHeaders = [
  "Email Address",
  "First Name",
  "Last Name",
  "Taxonomy",
  "Addresses",
];

export const userDocValidation = {
  doc_type: joi
    .string()
    .valid(...userDocumentTypes)
    .required(),
  doc_name: validateField.stringPrefixJoiValidation.required(),
  issuer_organization: validateField.stringPrefixJoiValidation.required(),
  issue_date: validateField.stringPrefixJoiValidation.allow(""),
  expiration_date: validateField.stringPrefixJoiValidation.allow(""),
  has_no_expiry: joi.boolean(),
  doc_id: validateField.stringPrefixJoiValidation.allow(""),
  doc_image: validateField.stringPrefixJoiValidation.allow(""),
  doc_url: validateField.stringPrefixJoiValidation.allow(""),
};

export const userValidations = {
  first_name: validateField.stringPrefixJoiValidation
    .alphanum()
    .min(2)
    .max(200)
    .required(),
  last_name: validateField.stringPrefixJoiValidation.alphanum().min(2).max(200),
  email: validateField.email,
  password: validateField.password,
  confirm_password: joi
    .valid(joi.ref("password"))
    .required()
    .options({
      messages: { "any.only": "{{#label}} must be same as password" },
    }),
  city: validateField.stringPrefixJoiValidation.required(),
  state: validateField.stringPrefixJoiValidation.required(),
  zip_code: validateField.stringPrefixJoiValidation.required(),
  personal_bio: validateField.stringPrefixJoiValidation.allow("").max(1000),
  banner_img: validateField.stringPrefixJoiValidation.required(),
  profile_img: validateField.stringPrefixJoiValidation.required(),
  socials: joi.object({
    twitter: validateField.stringPrefixJoiValidation.allow(""),
    linkedin: validateField.stringPrefixJoiValidation.allow(""),
    instagram: validateField.stringPrefixJoiValidation.allow(""),
    facebook: validateField.stringPrefixJoiValidation.allow(""),
  }),
  contact_email: validateField.stringPrefixJoiValidation.email().allow(""),
  educations: joi
    .array()
    .required()
    .min(1)
    .max(10)
    .items(
      joi.object({
        school_name: validateField.stringPrefixJoiValidation.required(),
        degree: validateField.stringPrefixJoiValidation.allow(""),
        field_of_study: validateField.stringPrefixJoiValidation.required(),
        start_date: joi.date().required(),
        end_date: joi.date().required(),
        is_in_progress: joi.boolean().default(true),
        activities: validateField.stringPrefixJoiValidation.allow(""),
        _id: validateField.stringPrefixJoiValidation,
      })
    ),
  licenses: joi.array().items(userDocValidation),
  certificates: joi.array().items(userDocValidation),
};

const paginationAllowedLimits = [5, 10, 20, 50, 100, 200, 500, 1000];

export const paginationValidation = {
  page: joi.number().min(1),
  limit: joi.number().valid(...paginationAllowedLimits),
};
