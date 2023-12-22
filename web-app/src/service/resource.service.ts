import { axiosGet, axiosPost } from "@/axios/config";

const getResources = async () => {
    return await axiosGet('/resources');
}

export {
    getResources
};