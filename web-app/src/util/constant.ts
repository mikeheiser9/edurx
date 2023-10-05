import * as Yup from "yup";
const validateField = {
  email: Yup.string().trim().required().email().max(150),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password must be at most 25 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
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
  "/welcome",
];

const protectedRoutes = ["/profile", "/forum"];

const forumTypes = [
  "Dietetics & Nutrition",
  "Medical professionals",
  "RDN",
  "NDTR",
  "Student",
];

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];

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
const postAccessRequestStatus = ["accepted", "denied", "pending"];
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

const statesNames = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
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
  allowedFileTypes,
  postAccessRequestStatus,
  statesNames,
};
