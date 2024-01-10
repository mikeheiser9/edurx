import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/axios/config";
import { TypeResourceData } from "@/types/resource";

export const getResources = (page: number = 1, limit: number = 20) => {
  return axiosGet("/admin/resource/resources", { params: { page, limit } });
};

export const getCategories = (
  page: number = 1,
  limit: number = 4,
  selectedCategoryIds: string[] = []
) => {
  return axiosGet("/admin/resource/category", {
    params: {
      page,
      limit,
      selectedCategoryIds,
    },
  });
};

export const deleteResourceById = (id: string) => {
  return axiosDelete("/admin/resource", { id: id });
};

export const updateResourceById = (id: string, data: TypeResourceData) => {
  return axiosPut(`/admin/resource`, data, {
    params: {
      id,
    },
  });
};

export const addResource = (data: TypeResourceData) => {
  return axiosPost(`/admin/resource`, data);
};
