import { axiosGet, axiosPost } from "@/axios/config";

const getResources = async (page:number,limit:number=5) => {
    return await axiosGet(`/resource/resources?page=${page}&limit=${limit}`);
}

export {
    getResources
};