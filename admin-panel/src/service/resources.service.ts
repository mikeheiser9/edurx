import { axiosDelete, axiosGet, axiosPut } from "@/axios/config";
import { TypeResourceData } from "@/types/resource";

export const getResources = () => {
  return axiosGet("/resource/resources");
};

export const deleteResourceById = (id: string) => {
  return axiosDelete("/resource/delete", { id: id });
};

export const updateResourceById = (id: string, data:TypeResourceData) => {
  return axiosPut(`/resource/resource?resource_id=${id}`, data);
};
