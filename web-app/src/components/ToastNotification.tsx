import { useDispatch, useSelector } from "react-redux";
import { removeToast, selectToast } from "@/redux/ducks/toast.duck";
import { useEffect } from "react";
import {ToastContainer,toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
const ToastNotification=()=>{
    const toastContent=useSelector(selectToast);
    const dispatch=useDispatch();
    useEffect(()=>{
        if(toastContent?.msg)
        {
            if(toastContent?.type=="success")
            {
                toast(toastContent?.msg)
            }
            else if(toastContent?.type=="error")
            {
                toast.error(toastContent?.msg);
            }
            setTimeout(()=>dispatch(removeToast()),500)
        }
    },[toastContent])
    return (
        <ToastContainer autoClose={2500} ></ToastContainer>
    )
}
export default ToastNotification;