import joi from "joi";
import { returnAppropriateError } from "../../util/commonFunctions.js";
import {
  roles,
  taxonomyCodeToProfessionalMapping,
  validateField,
} from "../../util/constant.js";
function addRequiredIfApplicable(req, baseValidation) {
  if (req.body.role.trim() == "student") {
    return baseValidation;
  }
  return baseValidation.required();
}
export const signUpFieldValidator = async (req, res, next) => {
  try {
    const roleTaxonomyCode = Object.keys(taxonomyCodeToProfessionalMapping);
    const { email, password, stringPrefixJoiValidation } = validateField;
    const schema = joi.object({
      first_name: stringPrefixJoiValidation
        .alphanum()
        .min(2)
        .max(200)
        .allow(""),
      last_name: stringPrefixJoiValidation.alphanum().min(2).max(200).allow(""),
      email,
      password,
      confirm_password: joi
        .valid(joi.ref("password"))
        .required()
        .options({
          messages: { "any.only": "{{#label}} must be same as password" },
        }),
      role: stringPrefixJoiValidation
        .min(3)
        .valid(...roles.slice(2))
        .required(),
      ...(req.body.role.trim() == "professional" && {
        npi_number: stringPrefixJoiValidation.length(10).required(),
        npi_designation: joi
          .array()
          .min(1)
          .items(stringPrefixJoiValidation.valid(...roleTaxonomyCode))
          .options({ stripUnknown: { arrays: true } })
          .required(),
      }),
      addresses: addRequiredIfApplicable(req, joi.array().min(1).max(2)),
      city: stringPrefixJoiValidation.allow(""),
      state: stringPrefixJoiValidation.allow(""),
      zip_code: stringPrefixJoiValidation.allow(""),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export const signInFieldValidator = async (req, res, next) => {
  try {
    const { email, password } = validateField;
    const schema = joi.object({
      email,
      password,
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export const sendVerificationCodeFieldValidator = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: validateField.email,
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export const verifyCodeFieldValidator = async (req, res, next) => {
  try {
    const { email, stringPrefixJoiValidation } = validateField;
    const schema = joi.object({
      email: email,
      code: stringPrefixJoiValidation.required(),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export const npiLookupValidator = async (req, res, next) => {
  try {
    const schema = joi.object({
      npi_number: validateField.stringPrefixJoiValidation.length(10).required(),
    });
    await schema.validateAsync(req.query);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export const universityLookupValidator = async (req, res, next) => {
  try {
    const schema = joi.object({
      domain: validateField.stringPrefixJoiValidation.required(),
    });
    await schema.validateAsync(req.query);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export const userExistsValidator = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: validateField.email,
    });
    await schema.validateAsync({
      email: req.query.email,
    });
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export const updateUserByAdminValidator = async (req, res, next) => {
  try {
    delete req.body.tax;
    if (req.body.role && req.body.role.trim() !== "professional")
      delete req.body.npi_number;
    const { email, stringPrefixJoiValidation } = validateField;
    const schema = joi.object({
      first_name: stringPrefixJoiValidation
        .alphanum()
        .min(2)
        .max(200)
        .allow(""),
      last_name: stringPrefixJoiValidation.alphanum().min(2).max(200).allow(""),
      username: stringPrefixJoiValidation.required(),
      email: email,
      password: stringPrefixJoiValidation.allow(""),
      role: stringPrefixJoiValidation
        .min(3)
        .valid(...roles)
        .required(),
      ...(req.body.role &&
        req.body.role.trim() == "professional" && {
          npi_number: stringPrefixJoiValidation.length(10).required(),
          // npi_designation: joi
          //   .array()
          //   .min(1)
          //   .items(stringPrefixJoiValidation.valid(...roleTaxonomyCode))
          //   .options({ stripUnknown: { arrays: true } })
          //   .required(),
        }),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log({ error });
    returnAppropriateError(res, error);
  }
};

export const checkIsSuperAdmin = (req, res, next) => {
  try {
    if ((req?.user).role == "super_admin") {
      next();
    } else {
      return generalResponse(
        res,
        null,
        "you are not authorize to access it",
        "error",
        false,
        403
      );
    }
  } catch (error) {
    return generalResponse(
      res,
      null,
      "something went wrong",
      "error",
      false,
      400
    );
  }
};
