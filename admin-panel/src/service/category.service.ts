import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/axios/config";
import { TypeCategoryFilter } from "@/types/resource";

export const getCategoryFilter = (page: number = 1, limit: number = 20) => {
  return axiosGet("/admin/categories", { params: { page, limit } });
};

export const addCategoryFilter = (data: TypeCategoryFilter) => {
  return axiosPost(`/admin/categories`, data);
};
export const deleteCategoryFilterById = (id: string) => {
  return axiosDelete("/admin/categories", { id: id });
};

export const updateCategoryFilterById = (id: string, data: TypeCategoryFilter) => {
return axiosPut(`/admin/categories`, data, {
    params: {
      user_id: id,
    },
  });
};
