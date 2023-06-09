import { axiosPost } from "@/axios/config"
import { userLoginField } from "@/util/interface/user.interface"

export const login=(data:userLoginField)=>{
   return axiosPost('/auth/sign_in',data)
}

export const signUp=<T>(data:T)=>{
   return axiosPost('/auth/sign_up',data)
}

export const verifyConfirmationCode=<T>(data:T)=>{
   return axiosPost('/auth/verify_verification_code',data)
}