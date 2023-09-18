import { axiosGet, axiosPost } from "@/axios/config";
import { AxiosResponse } from "axios";

const addNewPost = async <T>(payload: T): Promise<AxiosResponse> => {
  return await axiosPost("/post/create", payload);
};

const getComments = async (
  postId: string,
  pagination: {
    page: number;
    limit: number;
  }
): Promise<AxiosResponse> => {
  return await axiosGet(`/post/${postId}/comments`, { params: pagination });
};

const addNewComment = async <T>(payload: T): Promise<AxiosResponse> => {
  return await axiosPost("/post/comment", payload);
};

const addPostView = async <T>(payload: T): Promise<AxiosResponse> => {
  return await axiosPost("/post/views/add-view", payload);
};

const addUserReactionByAPI = async <T>(payload: T): Promise<AxiosResponse> => {
  return await axiosPost("/post/reaction", payload);
};

export {
  addNewPost,
  getComments,
  addNewComment,
  addPostView,
  addUserReactionByAPI,
};
