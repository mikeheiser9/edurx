import { setToast } from "@/redux/ducks/toast.duck";
import { removeToken, removeUserDetail } from "@/redux/ducks/user.duck";
import { AppDispatch } from "@/redux/store";
import { responseCodes } from "@/util/constant";
import axios, { AxiosRequestConfig } from "axios";

export const axiosParse = (store: AppDispatch) => {
  axios.interceptors.request.use((request) => {
    if (request.headers) {
      request.headers.Authorization = `JWT ${store.getState().user.token}`;
    }
    return request;
  });
  axios.interceptors.response.use(
    (response) => {
      if (response?.data?.toast) {
        store.dispatch(
          setToast({
            toastMessage: { msg: response.data.message, type: "success" },
          })
        );
      }
      return response;
    },
    (e) => {
      const status = e?.response?.status;
      if (status == responseCodes.FORBIDDEN) {
        store.dispatch(removeToken());
        store.dispatch(removeUserDetail());
      }
      if (status == 400 && e?.response?.data?.toast) {
        store.dispatch(
          setToast({
            toastMessage: { msg: e.response.data.message, type: "error" },
          })
        );
      }
      return e.response;
    }
  );
};

export const axiosGet = (url: string, options?: AxiosRequestConfig) => {
  return axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, options);
};

export const axiosPost = <T>(
  url: string,
  data: T,
  options?: AxiosRequestConfig
) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    data,
    options
  );
};

export const axiosPut = <T>(
  url: string,
  data: T,
  options?: AxiosRequestConfig
) => {
  return axios.put(
    `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    data,
    options
  );
};

export const axiosDelete = (url: string) => {
  return axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`);
};
