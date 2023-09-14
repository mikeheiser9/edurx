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

const protectedRoutes = ["/profile", "/forum"];

const forumTypes = [
  "Dietetics & Nutrition",
  "Medical professionals",
  "RDN",
  "NDTR",
  "Student",
];

const roles = ["super_admin", "moderator", "professional", "student"];

const roleBasedForum = {
  super_admin: forumTypes, // all forum acces
  moderator: forumTypes, // all forum acces
  professional: [
    "Dietetics & Nutrition",
    "Medical professionals",
    "RDN",
    "NDTR",
  ],
  student: ["Student"],
};

const postTypes = ["post", "poll"];
const postStatus = ["draft", "published"];
const postFlags = ["Misinformation", "Unrelated", "Irrelevant"];
const responseTypes = {
  UNAUTHORIZED: "Unauthorized",
  ERROR: "Error",
  SUCCESS: "Success",
  OK: "OK",
  BAD_REQUEST: "Bad request",
  NOT_FOUND: "Resource not found",
  INVALID_REQUEST: "Invalid request",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

const responseCodes = {
  UNAUTHORIZED: 401,
  SUCCESS: 200,
  ERROR: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_ACCEPTABLE: 406,
  FORBIDDEN: 403,
};

const roleAccess = {
  ADMIN: roles[0],
  MODERATOR: roles[1],
  PROFESSIONAL: roles[2],
  STUDENT: roles[3],
};
export {
  validateField,
  taxonomyCodeToProfessionalMapping,
  publicRoutes,
  protectedRoutes,
  npiToDefinition,
  forumTypes,
  postTypes,
  postStatus,
  roles,
  roleBasedForum,
  responseCodes,
  responseTypes,
  postFlags,
  roleAccess,
};
