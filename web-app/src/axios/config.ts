import { removeToken, removeUserDetail } from "@/redux/ducks/user.duck";
import { AppDispatch } from "@/redux/store";
import axios from "axios"
export const axiosParse=(store:AppDispatch)=>{
    axios.interceptors.request.use((request)=>{
        if(request.headers)
        {
            request.headers.Authorization=`JWT ${store.getState().user.token}`;
        }
        return request
    })
    axios.interceptors.response.use((response)=>{
        return response
    },(e)=>{
        // console.log(e.response);
        
        const status=e?.response?.status
        if(status==403)
        {
            store.dispatch(removeToken());
            store.dispatch(removeUserDetail())
        }
        // e.response? e.response : Promise.reject(new Error(e))
        return e.response
    })
}
export const axiosGet=(url:string)=>{
    return axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`)
}

export const axiosPost=<T>(url:string,data:T)=>{
    return axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,data)
}

export const axiosPut=<T>(url:string,data:T)=>{
    return axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,data)
}

export const axiosDelete=(url:string)=>{
    return axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`)
}