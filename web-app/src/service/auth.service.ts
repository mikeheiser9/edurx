import { axiosPost } from "@/axios/config"
import { userLoginField } from "@/util/interface/user.interface"

export const login=(data:userLoginField)=>{
   return axiosPost('/auth/sign_in',data)
}