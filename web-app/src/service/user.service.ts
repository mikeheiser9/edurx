import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/axios/config";
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

const getNotificationOfUser = (
  page: number,
  limit: number,
  notificationType?: string,
  isNew?: boolean,
  eventTime?: string
) => {
  return axiosGet(
    `/notification/user/all?page=${page}&limit=${limit}&notificationType=${notificationType}&isNew=${isNew}&eventTime=${eventTime}`
  );
};

const getTimeSensitiveNotification = (page: number, limit: number) => {
  return axiosGet(`/notification/time-sensitive?page=${page}&limit=${limit}`);
};

const dismissTimeSensitiveNotificationById = (notificationId: string) => {
  return axiosPut(`/notification/time-sensitive/dismiss/${notificationId}`, {});
};

const remindMeTomorrowTimeSensitiveNotificationById = (
  notificationId: string
) => {
  return axiosPut(
    `/notification/time-sensitive/remindMeTomorrow/${notificationId}`,
    {}
  );
};

const getUserDraftCount = () => {
  return axiosGet(`/user/drafts/count`);
};

const getUserDrafts = (page: number, limit: number) => {
  return axiosGet(`/user/drafts?page=${page}&limit=${limit}`);
};

const deleteDraftById=(id:string)=>{
  return axiosDelete(`/user/draft/${id}`)
}

export {
  searchUserByAPI,
  addRemoveUserConnectionByAPI,
  getAccountSettingsByAPI,
  updateAccountSettingsByAPI,
  getNotificationOfUser,
  getTimeSensitiveNotification,
  dismissTimeSensitiveNotificationById,
  remindMeTomorrowTimeSensitiveNotificationById,
  getUserDraftCount,
  getUserDrafts,
  deleteDraftById
};

