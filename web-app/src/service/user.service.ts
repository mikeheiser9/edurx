import { axiosGet } from "@/axios/config";
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

export { searchUserByAPI };
