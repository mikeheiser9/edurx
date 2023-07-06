import { Router } from "express";
import { userAuth } from "../middleware/passport/userAuth.js";
import {
  createPost,
  doLike,
  doComment,
  getUsersPosts,
} from "../controllers/post.js";
import {
  createPostValidator,
  getUsersPostsValidator,
} from "../middleware/validator/post.js";

const postRoute = Router();

postRoute.post("/create", createPostValidator, userAuth, createPost);
postRoute.post("/:postid/like", userAuth, doLike);
postRoute.post("/:postid/comment", userAuth, doComment);
postRoute.get("/user/:userId", getUsersPostsValidator, userAuth, getUsersPosts);

export default postRoute;