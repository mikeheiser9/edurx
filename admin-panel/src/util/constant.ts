import * as Yup from "yup";

export const responseCodes = {
  UNAUTHORIZED: 401,
  SUCCESS: 200,
  ERROR: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_ACCEPTABLE: 406,
  FORBIDDEN: 403,
};

export const validateField = {
  email: Yup.string()
    .trim()
    .required()
    .email("Please enter a valid email")
    .max(150),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password must be at most 25 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  stringPrefixJoiValidation: Yup.string().trim(),
};

export const USER_ROLES = {
  super_admin: {
    value:"super_admin",
    label:"Super Admin"
  },
  moderator: {
    value:"moderator",
    label:"Moderator"
  },
  professional: {
    value:"professional",
    label:"Professional"
  },
  student: {
    value:"student",
    label:"Student"
  }
};

export const ErrorMessage:any= {
  userNotFound:"User Not Found!",
  userExistWithEmail:"Another User Already Exist with this Email",
  userExistWithUsername:"Another User Already Exist with this Username",
  invalidNpi:"Invalid Npi Number!!"
}

export const EMAIL_VALIDATION = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

export const RESOURCE_TYPE = {
  resource:"resource",
  news:"news"
}

export const CATEGORYFILTER_TYPE = {
  category:"category",
  filter:"filter"
}