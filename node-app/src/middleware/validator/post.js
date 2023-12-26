import { validateObjectIds } from "../../repository/post.js";
import {
  generalResponse,
  getAllowedForumAccessBasedOnRoleAndNpiDesignation,
  returnAppropriateError,
} from "../../util/commonFunctions.js";
import {
  forumTypes,
  paginationValidation,
  postAccessRequestStatus,
  postCategoryFilterTypes,
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
  filters: Joi.array().max(50).items(validateField.objectId),
};

const customeValidator = (values, helper) => {
  if (values.replace(/<\/?[^>]+(>|$)/g, "").length > 5000) {
    return helper.message("char limit exceed(allowed 5000 char)");
  }
  return values;
};

const createOrUpdatePostValidator = async (req, res, next) => {
  try {
    const { stringPrefixJoiValidation, objectId } = validateField;
    const filterCategoryValidation = Joi.array().max(50).items(objectId);
    const role = req.user.role;
    const npi_designation = req.user.npi_designation;
    const forum = getAllowedForumAccessBasedOnRoleAndNpiDesignation(
      role,
      npi_designation
    );
    const schema = Joi.object({
      userId: validateField.objectId.required(),
      forumType: Joi.string().valid(...forum),
      postType: stringPrefixJoiValidation.valid(...postType).required(),
      postStatus: stringPrefixJoiValidation.valid(...postStatus).required(),
      title: stringPrefixJoiValidation.required().max(250),
      content: Joi.string().when("postStatus", {
        is: "published",
        then: Joi.string().required().custom(customeValidator),
        otherwise: Joi.string().allow("").custom(customeValidator),
      }),
      categories: filterCategoryValidation,
      filters: filterCategoryValidation,
      options: Joi.array().when("postType", {
        is: "poll",
        then: Joi.array()
          .min(2)
          .max(8)
          .items(stringPrefixJoiValidation)
          .unique(),
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
    const role = req.user.role;
    const npi_designation = req.user.npi_designation;
    const forum = getAllowedForumAccessBasedOnRoleAndNpiDesignation(
      role,
      npi_designation
    );
    const schema = Joi.object({
      userId: validateField.objectId.required(),
      ...paginationValidation,
      ...allPostValidations,
      forumType: Joi.string().valid(...forum),
    });

    await schema.validateAsync({
      ...req.query,
      userId: req.user._id?.toString(),
      categories: req.query?.categories?.split(","),
      filters: req.query?.filters?.split(","),
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
        .valid(...postCategoryFilterTypes)
        .required(),
      name: Joi.string().required().min(3),
      forumType: Joi.array().items(Joi.string().valid(...forumTypes)),
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
    const role = req.user.role;
    const npi_designation = req.user.npi_designation;
    const forum = getAllowedForumAccessBasedOnRoleAndNpiDesignation(
      role,
      npi_designation
    );
    const schema = Joi.object({
      type: Joi.string()
        .valid(...postCategoryFilterTypes)
        .required(),
      name: validateField.stringPrefixJoiValidation
        .required()
        .allow("")
        .max(100),
      forumType: Joi.string().valid(...forum),
      ...paginationValidation,
    });
    await schema.validateAsync(req.query);
    next();
  } catch (error) {
    return returnAppropriateError(res, error);
  }
};

const validateCategoryFilter = async (req, res, next) => {
  try {
    if (req.body?.categories?.length || req.body?.filters?.length) {
      const objectIds = [
        ...new Set([...req.body.categories, ...req.body.filters]),
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
      // if reactionType is nuill then user has removed the reaction
      _id: validateField.objectId,
      reactionType: Joi.string().valid("like", "dislike", null).required(),
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
      content: Joi.string().required().max(500),
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
      ...(req.body.parentId && {
        replyOnDetails: Joi.object({
          commentId: validateField.objectId
            .required()
            .disallow(Joi.ref("postId"), Joi.ref("userId")),
          commentOwner: validateField.objectId
            .required()
            .disallow(Joi.ref("postId")),
        }).required(),
      }),
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
    const role = req.user.role;
    const npi_designation = req.user.npi_designation;
    const forum = getAllowedForumAccessBasedOnRoleAndNpiDesignation(
      role,
      npi_designation
    );
    const schema = Joi.object({
      ...paginationValidation,
      ...allPostValidations,
      forumType: Joi.string().valid(...forum),
    });
    await schema.validateAsync({
      ...req.query,
      categories: req.query?.categories?.split(","),
      filters: req.query?.filters?.split(","),
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

const followUnfollowPostValidator = async (req, res, next) => {
  try {
    const { objectId } = validateField;
    const schema = Joi.object({
      postId: objectId.required(),
      action: Joi.string()
        .valid(...["add", "remove"])
        .required(),
    });
    await schema.validateAsync(req.params);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const deletePostDraftValidator = async (req, res, next) => {
  try {
    const { objectId } = validateField;
    await Joi.object({
      id: objectId.required(),
    }).validateAsync(req.params);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

const validatePollVote = async (req, res, next) => {
  try {
    const { objectId } = validateField;
    await Joi.object({
      postId: objectId.required(),
      option: Joi.string().required(),
    }).validateAsync({ ...req.body, ...req.params });
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};

export {
  createOrUpdatePostValidator,
  getUsersPostsValidator,
  createMetaLabelValidator,
  searchMetaLabelValidator,
  validateCategoryFilter,
  addReactionValidator,
  addCommentValidator,
  getPostCommentsValidator,
  getAllPostValidator,
  addViewValidator,
  updatePostValidator,
  addRequestValidator,
  getRequestValidator,
  bulkRequestUpdateValidator,
  followUnfollowPostValidator,
  deletePostDraftValidator,
  validatePollVote,
};
