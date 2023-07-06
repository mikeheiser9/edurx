import {
  joiObjectIdValidator,
  returnAppropriateError,
} from "../../util/commonFunctions.js";
import { forumTypes, postType } from "../../util/constant.js";
import { validateField } from "../../util/constant.js";
import Joi from "joi";

const createPostValidator = async (req, res, next) => {
  try {
    const { stringPrefixJoiValidation } = validateField;
    const schema = Joi.object({
      userId: validateField.stringPrefixJoiValidation
        .required()
        .custom(joiObjectIdValidator, "Invalid Object ID"),
      forumType: stringPrefixJoiValidation.valid(...forumTypes).required(),
      postType: stringPrefixJoiValidation.valid(...postType).required(),
      title: stringPrefixJoiValidation.required().max(200),
      content: stringPrefixJoiValidation.max(1000),
      categories: Joi.array()
        .required()
        .max(10)
        .items(stringPrefixJoiValidation.required()),
      tags: stringPrefixJoiValidation.max(300),
      options: Joi.any().when("postType", {
        is: "poll",
        then: stringPrefixJoiValidation.required(),
        otherwise: stringPrefixJoiValidation.optional(),
      }),
      isPrivate: Joi.boolean(),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log({ error });
    returnAppropriateError(res, error);
  }
};

const getUsersPostsValidator = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const schema = Joi.object({
      userId: validateField.stringPrefixJoiValidation
        .required()
        .custom(joiObjectIdValidator, "Invalid Object ID"),
    });

    await schema.validateAsync({ userId });
    next();
  } catch (error) {
    return returnAppropriateError(res, error);
  }
};

export { createPostValidator, getUsersPostsValidator };
