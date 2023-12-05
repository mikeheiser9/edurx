import { axiosGet, axiosPost } from "@/axios/config";
import { AxiosResponse } from "axios";

const getResources = async () => {
    return await axiosGet('/resources');
}

export {
    getResources
};