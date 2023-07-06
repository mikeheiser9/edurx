import { postModal } from "../model/post.js";

const createNewPost = async (payload) => {
  return await postModal.create(payload);
};

const findPostsByUserId = async (userId) => {
  return await postModal.find({ userId });
};

export { createNewPost, findPostsByUserId };
