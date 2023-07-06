import Joi from "joi";
import {
  joiObjectIdValidator,
  returnAppropriateError,
} from "../../util/commonFunctions.js";
import {
  userDocValidation,
  userDocumentTypes,
  userValidations,
  validateField,
} from "../../util/constant.js";

const updateUserValidator = async (req, res, next) => {
  try {
    if (!req.body || !Object.keys(req.body).length) {
      returnAppropriateError(res, {
        details: [
          {
            message: "Invalid request body or request missing required fields",
          },
        ],
      });
    }
    req.body =
      req.files?.length && req.body?.data
        ? JSON.parse(req?.body?.data)
        : req.body;
    const schema = Joi.object({
      ...Object.keys(req.body).reduce((acc, key) => {
        if (userValidations[key]) {
          acc[key] = userValidations[key];
        }
        return acc;
      }, {}),
      userId: validateField.stringPrefixJoiValidation
        .required()
        .custom(joiObjectIdValidator, "Invalid Object ID"),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    returnAppropriateError(res, error);
  }
};

const getUserProfileValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: validateField.stringPrefixJoiValidation
        .required()
        .custom(joiObjectIdValidator, "Invalid Object ID"),
    });
    await schema.validateAsync(req.params);
    next();
  } catch (err) {
    returnAppropriateError(res, err);
  }
};

const addDocumentValidator = async (req, res, next) => {
  try {
    req.body = req.files?.length ? JSON.parse(req?.body?.data) : req.body;
    const schema = Joi.object({
      ...userDocValidation,
      ...(Object.keys(req.body).includes("_id") && {
        _id: validateField.stringPrefixJoiValidation
          .required()
          .custom(joiObjectIdValidator, "Invalid Object ID"),
      }),
      userId: validateField.stringPrefixJoiValidation
        .required()
        .custom(joiObjectIdValidator, "Invalid Object ID"),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    returnAppropriateError(res, err);
  }
};

const getUserDocumentsValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().custom(joiObjectIdValidator, "Invalid Object ID"),
      doc_type: Joi.string()
        .valid(...userDocumentTypes)
        .required(),
    });
    await schema.validateAsync({
      userId: req.params.userId,
      doc_type: req.query.doc_type,
    });
    next();
  } catch (err) {
    console.log(err);
    returnAppropriateError(res, err);
  }
};

export {
  updateUserValidator,
  getUserProfileValidator,
  addDocumentValidator,
  getUserDocumentsValidator,
};
