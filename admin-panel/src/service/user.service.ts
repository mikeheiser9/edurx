import { axiosDelete, axiosGet } from "@/axios/config";

export const getUsers = () => {
  return axiosGet("/admin/users");
};

export const deleteUserById = (id: string) => {
  return axiosDelete("/admin/user", { id: id });
};

export const updateUserById = (id: string ,data:any) => {
    return axiosDelete("/admin/user", { id: id });
  };
  