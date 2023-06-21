import { axiosPost } from "@/axios/config";
import { userLoginField } from "@/util/interface/user.interface";
import axios from "axios";

export const login = (data: userLoginField) => {
  return axiosPost("/auth/sign_in", data);
};

export const signUp = <T>(data: T) => {
  return axiosPost("/auth/sign_up", data);
};

export const verifyConfirmationCode = <T>(data: T) => {
  return axiosPost("/auth/verify_verification_code", data);
};

export const generateVerificationCode = <T>(data: T) => {
  return axiosPost("/auth/send_verification_code", data);
};

export const npiNumberLookup = (npi_number: string): Promise<any> => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/npi_number_lookup` as string,
    {
      params: {
        npi_number,
      },
    }
  );
};
