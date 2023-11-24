import Joi from "joi";
import {
  generalResponse,
  returnAppropriateError,
} from "../../util/commonFunctions.js";
import {
  NOTIFICATION_TYPES,
  paginationValidation,
  responseCodes,
  responseTypes,
  roles,
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
    req.body = req.body?.data ? JSON.parse(req?.body?.data) : req.body;
    const schema = Joi.object({
      ...Object.keys(req.body).reduce((acc, key) => {
        if (userValidations[key]) {
          acc[key] = userValidations[key];
        }
        return acc;
      }, {}),
      userId: validateField.objectId.required(),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const getUserProfileValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: validateField.objectId.required(),
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
        _id: validateField.objectId.required(),
      }),
      userId: validateField.objectId.required(),
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
      userId: validateField.objectId.required(),
      doc_type: Joi.string()
        .valid(...userDocumentTypes)
        .required(),
      ...paginationValidation,
    });
    await schema.validateAsync({
      ...req.query,
      ...req.params,
    });
    next();
  } catch (err) {
    returnAppropriateError(res, err);
  }
};

const userConnectionsValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      action: Joi.string().valid("add", "remove"),
      userId: validateField.objectId.required(),
      targetUserId: validateField.objectId
        .required()
        .disallow(Joi.ref("userId")),
    });
    await schema.validateAsync({
      action: req.params.action,
      ...req.body,
    });
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const getConnectionsValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: validateField.objectId.required(),
      type: Joi.string().required().valid("followers", "following"),
      ...paginationValidation,
    });
    await schema.validateAsync({
      ...req.query,
      ...req.params,
    });
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const searchUsersValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      ...paginationValidation,
      searchKeyword: Joi.string().allow("").max(50),
    });
    await schema.validateAsync(req.query);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const adminAuthValidation = async (req, res, next) => {
  try {
    if (req.user?.role === roles[0]) await next();
    else {
      return generalResponse(
        res,
        responseCodes.UNAUTHORIZED,
        responseTypes.UNAUTHORIZED,
        "You are not authorized to perform this action",
        null
      );
    }
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const createAccountSettingsValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      allowedTypes: Joi.array()
        .items(
          Joi.string()
            .required()
            .valid(...Object.values(NOTIFICATION_TYPES.All))
        )
        .required(),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export {
  updateUserValidator,
  getUserProfileValidator,
  addDocumentValidator,
  getUserDocumentsValidator,
  userConnectionsValidator,
  getConnectionsValidator,
  searchUsersValidator,
  adminAuthValidation,
  createAccountSettingsValidator,
};
