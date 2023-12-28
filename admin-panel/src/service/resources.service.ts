import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/axios/config";
import { TypeResourceData } from "@/types/resource";

export const getResources = () => {
  return axiosGet("/admin/resource/resources");
};

export const getCategories = (params?:object) => {
  return axiosGet("/admin/resource/category",{ params });
};

export const deleteResourceById = (id: string) => {
  return axiosDelete("/admin/resource", { id: id });
};

export const updateResourceById = (id: string, data: TypeResourceData) => {
  return axiosPut(`/admin/resource`, data);
};

export const addResource = (data: TypeResourceData) => {
  return axiosPost(`/admin/resource`, data);
};

