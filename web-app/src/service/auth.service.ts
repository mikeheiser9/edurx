import { axiosGet, axiosPost } from "@/axios/config";
import axios, { AxiosPromise, AxiosResponse } from "axios";

export const login = (data: userLoginField) => {
  return axiosPost("/auth/sign_in", data);
};

export const userAlreadyExists = (email: string): AxiosPromise => {
  return axiosGet("/auth/user_exists", {
    params: { email },
  });
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

export const npiNumberLookup = async (
  npi_number: string
): Promise<AxiosResponse> => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/npi_number_lookup` as string,
    {
      params: {
        npi_number,
      },
    }
  );
};

export const universityLookup = async (
  domain: string
): Promise<AxiosResponse> => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/university_lookup`,
    {
      params: {
        domain,
      },
    }
  );
};

export const postToGoogleSheet = async (
  payload: googleSheetPayload
): Promise<AxiosPromise> => {
  return await axiosPost("/google-sheets/add-to-sheet", payload);
};
