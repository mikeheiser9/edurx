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

const updateAccountSettingsByAPI = async <T>(payload: T) => {
  return await axiosPost("/user/account-settings", payload);
};

const getAccountSettingsByAPI = async () => {
  return await axiosGet("/user/account-settings");
};

export {
  searchUserByAPI,
  addRemoveUserConnectionByAPI,
  getAccountSettingsByAPI,
  updateAccountSettingsByAPI,
};
