import { axiosGet } from "@/axios/config";
import {
  selectToken,
  selectUserDetail,
  setUserDetail,
} from "@/redux/ducks/user.duck";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const requireAuthentication = (WrappedComponent: NextPage, fetchProfile?:boolean) => {
  return (props: any) => {
    const router = useRouter();
    const token = useSelector(selectToken);
    const user = useSelector(selectUserDetail);
    const dispatch = useDispatch();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const validateToken = () => {
      axiosGet("/user/profile")
        .then((response) => {
          if (
            response.status === 200 &&
            response.data?.data?.user?._id === user?._id
          ) {
            fetchProfile && dispatch(setUserDetail(response?.data?.data?.user));
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            router.replace("/");
          }
        })
        .catch((err) => console.error("Failed to authenticate user", err));
    };

    useEffect(() => {
      // If the user is not authenticated, redirect to the login page
      if (!token || !user?._id) {
        router.push("/");
      } else if (user?._id && token) {
        validateToken();
      }
    }, [token]);

    // Render the wrapped component if the user is authenticated
    return (
      isAuthorized && token && user?._id && <WrappedComponent {...props} />
    );
  };
};
