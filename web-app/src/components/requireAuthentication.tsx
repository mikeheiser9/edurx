import { axiosGet } from "@/axios/config";
import { selectToken, selectUserDetail } from "@/redux/ducks/user.duck";
import { responseCodes } from "@/util/constant";
import { NextPage } from "next";
import { useRouter } from "next/navigation"; // Update import
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const requireAuthentication = (WrappedComponent: NextPage) => {
  const AuthenticatedComponent: NextPage<any> = (props) => {
    const router = useRouter();
    const token = useSelector(selectToken);
    const user = useSelector(selectUserDetail);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const validateToken = async () => {
      if (!user?._id) throw new Error("Invalid token");
      try {
        const response = await axiosGet(`/user/${user?._id}/profile`, {
          params: {
            isAuthCheck: true,
          },
        });

        if (
          response?.status === responseCodes.SUCCESS &&
          response?.data?.data?.user?._id === user?._id
        ) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.replace("/");
        }
      } catch (err) {
        console.error("Failed to authenticate user", err);
      }
    };

    useEffect(() => {
      if (!token || !user?._id) {
        router.push("/");
      } else if (user?._id && token) {
        validateToken();
      }
    }, [token]);

    if (!isAuthorized || !token || !user?._id) return null;

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};
