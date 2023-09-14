import { axiosGet, axiosPost } from "@/axios/config";
import { AxiosResponse } from "axios";

const searchUserByAPI = async (
  searchKeyword: string,
  pagination: {
    page: number;
    limit: number;
  }
): Promise<AxiosResponse> => {
  return await axiosGet("/user/search", {
    params: { searchKeyword, ...pagination },
  });
};

const addRemoveUserConnectionByAPI = async <T>(
  type: "add" | "remove",
  payload: T
): Promise<AxiosResponse> => {
  return await axiosPost(`/user/connections/${type}`, payload);
};

export { searchUserByAPI, addRemoveUserConnectionByAPI };
