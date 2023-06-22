import joi from "joi";

export const validateField = {
  email: joi.string().trim().required().email().max(150),
  password: joi.string().required(),
  stringPrefixJoiValidation: joi.string().trim(),
};

export const roles = ["super_admin", "moderator", "professional", "student"];

export const forumTypes = [
  "Dietetics & Nutrition",
  "Medical professionals",
  "RDN",
  "NDTR",
  "Student",
];

export const postType = ["post", "poll"];

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
