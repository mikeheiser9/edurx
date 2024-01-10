import { axiosGet, axiosPost } from "@/axios/config";

export const getResources = async (
  page: number = 1,
  limit: number = 10,
  filter: string = "resources"
) => {
  return await axiosGet(`/resource/resources`, {
    params: {
      page,
      limit,
      filter,
    },
  });
};
