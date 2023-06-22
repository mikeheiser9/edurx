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

const publicRoutes = [
  "/",
  "/signup",
  "/signup/student",
  "/signup/professional",
];

const protectedRoutes = [
    "/profile",
];
export { validateField, taxonomyCodeToProfessionalMapping, publicRoutes, protectedRoutes };
