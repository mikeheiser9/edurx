import { axiosGet, axiosPost, axiosPut } from "@/axios/config";
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

const updatePostByAPI = async <T>(payload: T): Promise<AxiosResponse> => {
  return await axiosPut("/post/admin/update", payload);
};

const addPrivatePostRequest = async <T>(payload: T): Promise<AxiosResponse> => {
  return await axiosPost("/post/private/create-request", payload);
};

const getPostRequests = async (
  postId: string,
  pagination: { page: number; limit: number }
): Promise<AxiosResponse> => {
  return await axiosGet(`/post/private/${postId}/requests`, {
    params: pagination,
  });
};

const updatePostRequestsByAPI = async (
  postId: string,
  payload: { _id: string; status: PostRequestStatus }[]
): Promise<AxiosResponse> => {
  return await axiosPut(`/post/private/${postId}/requests-update`, payload);
};

export {
  addNewPost,
  getComments,
  addNewComment,
  addPostView,
  addUserReactionByAPI,
  updatePostByAPI,
  addPrivatePostRequest,
  getPostRequests,
  updatePostRequestsByAPI,
};
