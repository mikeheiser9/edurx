import { axiosPost } from "@/axios/config"
import { TypeAdminLogin } from "@/types/auth"


export const validateAdmin=(data:TypeAdminLogin)=>{
    return axiosPost('/admin/login',data)
}