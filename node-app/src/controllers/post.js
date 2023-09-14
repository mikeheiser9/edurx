import { Types } from "mongoose";
import {
  addCategoryTag,
  addComment,
  addReaction,
  addViews,
  createNewPost,
  getCommentsByPostId,
  getPostById,
  getPosts,
  searchCategoryTagByName,
  updatePostById,
} from "../repository/post.js";
import { generalResponse } from "../util/commonFunctions.js";
import { responseCodes, responseTypes } from "../util/constant.js";

const createPost = async (req, res) => {
  try {
    const post = await createNewPost(req.body);
    generalResponse(res, 200, "OK", "Post created", post, null);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, null, true);
  }
};

const searchPostMetaLabel = async (req, res) => {
  try {
    const { name, type, page, limit } = req.query;
    const searchResult = await searchCategoryTagByName(name, type, page, limit);
    let message = searchResult.records.length
      ? "records found"
      : "No records found";
    return generalResponse(res, 200, "success", message, searchResult);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

const addPostMetaLabel = async (req, res) => {
  try {
    const { metaLabel } = req.params;
    const response = await addCategoryTag({ ...req.body, type: metaLabel });
    return generalResponse(
      res,
      200,
      "success",
      `${metaLabel} created successfully`,
      response
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

const addNewReaction = async (req, res) => {
  try {
    const response = await addReaction(req.body);
    return generalResponse(
      res,
      200,
      "success",
      response.message,
      response.data
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

const addNewComment = async (req, res) => {
  try {
    const newComment = await addComment(req.body);
    return generalResponse(
      res,
      200,
      "success",
      "Comment added successfully",
      newComment
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const getPostComments = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const comments = await getCommentsByPostId(
      req.params.postId,
      Number(page || 1),
      Number(limit || 10),
      req?.user?._id
    );
    return generalResponse(
      res,
      200,
      "OK",
      "Comments fetched successfully",
      comments
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await getPostById(req.params.postId, req?.user?._id);
    return generalResponse(res, 200, "OK", "post fetched successfully", post);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const userId = req.route.path === "/forum/user" ? req?.user?._id : null;
    const categoryList = req.query.categories?.split(",");
    const posts = await getPosts({
      ...req.query,
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
      categories:
        categoryList?.length > 0 &&
        categoryList.map((category) => new Types.ObjectId(category)),
      userId,
    });
    return generalResponse(res, 200, "OK", "posts fetched successfully", posts);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const addNewView = async (req, res) => {
  try {
    // view can be single view or multiple
    const response = await addViews(req.body);
    return generalResponse(res, 200, "OK", response.message, response.data);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const updatePost = async (req, res) => {
  try {
    const response = await updatePostById(req.body);
    console.log(response);
    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.OK,
      "Post updated successfully",
      response
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.ERROR,
      responseTypes.ERROR,
      error?.message || "Something went wrong",
      error
    );
  }
};

export {
  createPost,
  searchPostMetaLabel,
  addPostMetaLabel,
  addNewReaction,
  addNewComment,
  getPostComments,
  getPost,
  getAllPosts,
  addNewView,
  updatePost,
};
