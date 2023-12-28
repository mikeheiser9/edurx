import { axiosDelete, axiosGet, axiosPut } from "@/axios/config";
import { TypeUserData } from "@/types/user";

export const getUsers = (searchKeyword?: string) => {
  let url = "/admin/users";
  if (searchKeyword && searchKeyword !== "") {
    url = url + `?search=${searchKeyword}`;
  }
  return axiosGet(url);
};

export const deleteUserById = (id: string) => {
  return axiosDelete("/admin/user", { id: id });
};

export const updateUserById = (id: string, data: TypeUserData) => {
  return axiosPut(`/admin/user`, data, {
    params: {
      user_id: id,
    },
  });
};
