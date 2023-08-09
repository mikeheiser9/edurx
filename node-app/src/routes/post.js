import { Router } from "express";
import { userAuth } from "../middleware/passport/userAuth.js";
import {
  createPost,
  searchPostMetaLabel,
  addPostMetaLabel,
  addNewReaction,
  addNewComment,
  getPostComments,
  getPost,
  getAllPosts,
  addNewView,
} from "../controllers/post.js";
import {
  addCommentValidator,
  addReactionValidator,
  addViewValidator,
  createMetaLabelValidator,
  createPostValidator,
  getAllPostValidator,
  getPostCommentsValidator,
  getUsersPostsValidator,
  searchMetaLabelValidator,
  validateCategoryTag,
} from "../middleware/validator/post.js";

const postRoute = Router();
postRoute.post(
  "/create",
  userAuth,
  createPostValidator,
  validateCategoryTag,
  createPost
);
postRoute.get("/:postId", userAuth, getPostCommentsValidator, getPost);
postRoute.post(
  "/:metaLabel/create",
  userAuth,
  createMetaLabelValidator,
  addPostMetaLabel
);
postRoute.get(
  "/:metaLabel/search",
  userAuth,
  searchMetaLabelValidator,
  searchPostMetaLabel
);
postRoute.post("/reaction", userAuth, addReactionValidator, addNewReaction);
postRoute.post("/comment", userAuth, addCommentValidator, addNewComment);
postRoute.post("/views/add-view", userAuth, addViewValidator, addNewView);
postRoute.get(
  "/:postId/comments",
  userAuth,
  getPostCommentsValidator,
  getPostComments
);
postRoute.get("/forum/all", userAuth, getAllPostValidator, getAllPosts);
postRoute.get("/forum/user", userAuth, getUsersPostsValidator, getAllPosts);

export default postRoute;
