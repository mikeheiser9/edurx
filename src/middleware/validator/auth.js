import joi from "joi";
import { returnAppropriateError } from "../../util/commonFunctions.js";
import { validateField } from "../../util/constant.js";
function addRequiredIfApplicable(req, baseValidation) {
  if (req.body.role.trim() == "student") {
    return baseValidation;
  }
  return baseValidation.required();
}
export const signUpFieldValidator = async (req, res, next) => {
  try {
    const { email, password,stringPrefixJoiValidation } = validateField;
    const schema = joi.object(
      {
      first_name: addRequiredIfApplicable(req,stringPrefixJoiValidation.alphanum().min(2).max(200)),
      last_name: addRequiredIfApplicable(req,stringPrefixJoiValidation.min(2).max(200)),
      email,
      password,
      confirm_password: joi.valid(joi.ref("password")).required().options({  messages: { "any.only": "{{#label}} must be same as password" },}),
      role: stringPrefixJoiValidation.required().min(3),
      ...(req.body.role.trim() != "student" && {
        npi_number: stringPrefixJoiValidation.length(10).required(),
        npi_designation: stringPrefixJoiValidation.min(2).max(200).required(),
      }),
      addresses: addRequiredIfApplicable(req, joi.array().min(1).max(2)),
      city: addRequiredIfApplicable(req, stringPrefixJoiValidation.min(2).max(50)),
      state: addRequiredIfApplicable(req, stringPrefixJoiValidation.min(2).max(50)),
      zip_code: addRequiredIfApplicable(req, stringPrefixJoiValidation),
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
    const {email,stringPrefixJoiValidation}=validateField
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
