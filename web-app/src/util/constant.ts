import * as Yup from "yup";
const validateField = {
  email: Yup.string().trim().required().email().max(150),
  password: Yup.string().required(),
  stringPrefixJoiValidation: Yup.string().trim(),
};
const taxonomyCodeToProfessionalMapping = {
  "133V00000X": "RDN",
  "136A00000X": "NDTR",
};

const npiToDefinition = {
  RDN: "Registered Dietitian",
  NDTR: "Dietetic Technician, Registered",
};

const publicRoutes = [
  "/",
  "/signup",
  "/signup/student",
  "/signup/professional",
];

const protectedRoutes = ["/profile"];

const forumTypes = [
  "Dietetics & Nutrition",
  "Medical professionals",
  "RDN",
  "NDTR",
  "Student",
];

const postTypes = ["post", "poll"];
const postStatus = ["draft", "published"];
export {
  validateField,
  taxonomyCodeToProfessionalMapping,
  publicRoutes,
  protectedRoutes,
  npiToDefinition,
  forumTypes,
  postTypes,
  postStatus,
};