import { Router } from "express";
import { userAuth } from "../middleware/passport/userAuth.js";
import {createPost,doLike,doComment} from "../controllers/post.js";
import { createPostValidator } from "../middleware/validator/post.js";
const postRoute=Router();
postRoute.post('/create',createPostValidator,userAuth,createPost)
postRoute.post('/:postid/like',userAuth,doLike)
postRoute.post('/:postid/comment',userAuth,doComment)
export default postRoute;