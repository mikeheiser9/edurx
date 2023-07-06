import { createNewPost, findPostsByUserId } from "../repository/post.js";
import { generalResponse } from "../util/commonFunctions.js";

const createPost = async (req, res) => {
  try {
    const post = await createNewPost(req.body);
    if (!post) throw new Error("Error creating post");
    generalResponse(res, 200, "OK", null, post, null);
  } catch (error) {
    return generalResponse(res, 500, "Internal Server Error", null, null, true);
  }
};

const getUsersPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = await findPostsByUserId(userId);
    return generalResponse(
      res,
      200,
      "success",
      "users posts fetched successfully",
      userPosts,
      false
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

const doLike = async (req, res) => {
  try {
  } catch (error) {
    return generalResponse(res, 400, "error", null, null, false);
  }
};

const doComment = async (req, res) => {
  try {
  } catch (error) {
    return generalResponse(res, 400, "error", null, null, false);
  }
};

export { createPost, doComment, doLike, getUsersPosts };
