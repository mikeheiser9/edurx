import { returnAppropriateError } from "../../util/commonFunctions.js";
import Joi from "joi";
import { validateField } from "../../util/constant.js";

const addSheetDataValidator = async (req, res, next) => {
  try {
    const { stringPrefixJoiValidation, email } = validateField;
    const schema = Joi.object({
      first_name: stringPrefixJoiValidation.min(1).max(200).required(),
      last_name: stringPrefixJoiValidation.min(1).max(200).required(),
      email,
      addresses: stringPrefixJoiValidation.required(),
      taxonomies: stringPrefixJoiValidation.required(),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export { addSheetDataValidator };
