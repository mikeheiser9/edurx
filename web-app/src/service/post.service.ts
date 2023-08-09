import { axiosPost } from "@/axios/config";
import { AxiosResponse } from "axios";

const addNewPost = async <T>(payload: T): Promise<AxiosResponse> => {
  return await axiosPost("/post/create", payload);
};

export { addNewPost };
