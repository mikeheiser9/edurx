import { validateObjectIds } from "../../repository/post.js";
import {
  generalResponse,
  returnAppropriateError,
} from "../../util/commonFunctions.js";
import {
  forumTypes,
  paginationValidation,
  postAccessRequestStatus,
  postCategoryTagsTypes,
  postFlags,
  postStatus,
  postType,
  roles,
} from "../../util/constant.js";
import { validateField } from "../../util/constant.js";
import Joi from "joi";

const verifyAuthAndUserId = (userId, userAuthId) => {
  return userId === userAuthId ? true : false;
};

const allPostValidations = {
  sortBy: Joi.string().valid("newest", "popular", "trending"),
  forumType: Joi.string().valid(...forumTypes),
  categories: Joi.array().max(50).items(validateField.objectId),
};

const createPostValidator = async (req, res, next) => {
  try {
    const { stringPrefixJoiValidation, objectId } = validateField;
    const tagCategoryValidation = Joi.array().max(50).items(objectId);
    const schema = Joi.object({
      userId: validateField.objectId.required(),
      forumType: stringPrefixJoiValidation.valid(...forumTypes).required(),
      postType: stringPrefixJoiValidation.valid(...postType).required(),
      postStatus: stringPrefixJoiValidation.valid(...postStatus).required(),
      title: stringPrefixJoiValidation.required().max(26),
      content: stringPrefixJoiValidation.allow("").max(100000),
      categories: tagCategoryValidation,
      tags: tagCategoryValidation,
      options: Joi.array().when("postType", {
        is: "poll",
        then: Joi.array().min(2).items(stringPrefixJoiValidation),
      }),
      votingLength: Joi.number().when("postType", {
        is: "poll",
        then: Joi.number().required().min(1),
      }),
      isPrivate: Joi.boolean(),
    });
    await schema.validateAsync(req.body);
    if (!verifyAuthAndUserId(req.body.userId, req.user._id?.toString()))
      throw Error("unAuthorized");
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const getUsersPostsValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: validateField.objectId.required(),
      ...paginationValidation,
      ...allPostValidations,
    });

    await schema.validateAsync({
      ...req.query,
      userId: req.user._id?.toString(),
      categories: req.query?.categories?.split(","),
    });
    next();
  } catch (error) {
    return returnAppropriateError(res, error);
  }
};

const createMetaLabelValidator = async (req, res, next) => {
  try {
    const { metaLabel } = req.params;
    if (req.user.role !== roles[0]) {
      return generalResponse(
        res,
        401,
        "unAuthorized",
        `You are not allowed to create a ${metaLabel}`,
        null
      );
    }
    const schema = Joi.object({
      type: Joi.string()
        .valid(...postCategoryTagsTypes)
        .required(),
      name: Joi.string().required().min(3),
    });
    await schema.validateAsync({
      ...req.body,
      type: metaLabel,
    });
    next();
  } catch (error) {
    return returnAppropriateError(res, error);
  }
};

const searchMetaLabelValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      type: Joi.string()
        .valid(...postCategoryTagsTypes)
        .required(),
      name: validateField.stringPrefixJoiValidation
        .required()
        .allow("")
        .max(100),
      ...paginationValidation,
    });
    await schema.validateAsync(req.query);
    next();
  } catch (error) {
    return returnAppropriateError(res, error);
  }
};

const validateCategoryTag = async (req, res, next) => {
  try {
    if (req.body?.categories?.length || req.body?.tags?.length) {
      const objectIds = [
        ...new Set([...req.body.categories, ...req.body.tags]),
      ];
      const response = await validateObjectIds(objectIds);
      if (response === objectIds.length) {
        next();
      } else {
        generalResponse(
          res,
          422,
          "Unprocessable Entity",
          "Tags or categories contains invalid values"
        );
      }
    } else {
      next();
    }
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const addReactionValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      reactionType: Joi.string().valid("like", "dislike").required(),
      userId: validateField.objectId.required(),
      targetType: Joi.string().valid("post", "comment").required(),
      postId: Joi.string().disallow(Joi.ref("userId")).when("targetType", {
        is: "post",
        then: validateField.objectId.required(),
      }),
      commentId: Joi.string().disallow(Joi.ref("userId")).when("targetType", {
        is: "comment",
        then: validateField.objectId.required(),
      }),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const addCommentValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      content: Joi.string().required(),
      userId: validateField.objectId.required(),
      postId: validateField.objectId.required().disallow(Joi.ref("userId")),
      taggedUsers: Joi.array()
        .max(50)
        .items(
          validateField.objectId.disallow(Joi.ref("userId"), Joi.ref("postId"))
        ),
      parentId: validateField.objectId.disallow(
        Joi.ref("userId"),
        Joi.ref("postId")
      ),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const getPostCommentsValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      postId: validateField.objectId.required(),
      ...paginationValidation,
    });
    await schema.validateAsync({ ...req.params, ...req.query });
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const getAllPostValidator = async (req, res, next) => {
  try {
    // filter options forumType, category, userId
    // sort options newest, most popular, trending
    const schema = Joi.object({
      ...paginationValidation,
      ...allPostValidations,
    });
    await schema.validateAsync({
      ...req.query,
      categories: req.query?.categories?.split(","),
    });
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const addViewValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: validateField.objectId.required(),
      itemType: Joi.string().valid("post", "comment").required(),
      itemId: Joi.alternatives(
        validateField.objectId.required(),
        Joi.array().items(validateField.objectId.required())
      )
        .disallow(Joi.ref("userId"))
        .required(),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const updatePostValidator = async (req, res, next) => {
  try {
    const { stringPrefixJoiValidation, objectId } = validateField;
    const schema = Joi.object({
      _id: objectId.required(),
      postStatus: stringPrefixJoiValidation.valid(...postStatus),
      title: stringPrefixJoiValidation.max(200),
      content: stringPrefixJoiValidation.max(10000),
      votingLength: Joi.number().when("postType", {
        is: "poll",
        then: Joi.number().required().min(1),
      }),
      isPrivate: Joi.boolean(),
      isDeleted: Joi.boolean(),
      flag: Joi.string().valid(...postFlags, null),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

// private post access request validation
const addRequestValidator = async (req, res, next) => {
  try {
    const { objectId } = validateField;
    const schema = Joi.object({
      _id: objectId,
      userId: objectId.required(),
      postId: objectId.required().disallow(Joi.ref("userId")),
      status: Joi.string()
        .valid(...postAccessRequestStatus)
        .required(),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const getRequestValidator = async (req, res, next) => {
  try {
    const { objectId } = validateField;
    // userId = req?.user?._id?.toString();
    const schema = Joi.object({
      ...paginationValidation,
      postId: objectId.required(),
      // userId: objectId.required().disallow(Joi.ref("postId")),
    });
    await schema.validateAsync({
      ...req.params,
      ...req.query,
    });
    next();
  } catch (error) {
    console.log(error);
    returnAppropriateError(res, error);
  }
};

const bulkRequestUpdateValidator = async (req, res, next) => {
  try {
    console.log(req.body);
    const { objectId } = validateField;
    const schema = Joi.array()
      .required()
      .min(1)
      .items(
        Joi.object({
          _id: objectId.required(),
          status: Joi.string()
            .valid(...postAccessRequestStatus)
            .required(),
        })
      );
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    returnAppropriateError(res, error);
  }
};

export {
  createPostValidator,
  getUsersPostsValidator,
  createMetaLabelValidator,
  searchMetaLabelValidator,
  validateCategoryTag,
  addReactionValidator,
  addCommentValidator,
  getPostCommentsValidator,
  getAllPostValidator,
  addViewValidator,
  updatePostValidator,
  addRequestValidator,
  getRequestValidator,
  bulkRequestUpdateValidator,
};
