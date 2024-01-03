"use client";
import { selectToken, selectUserDetail } from "@/redux/ducks/user.duck";
import { USER_ROLES } from "@/util/constant";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  children: JSX.Element;
}

const RouteGuard = ({ children }: Props) => {
  const [isAllowed, setIsAllowed] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const user = useSelector(selectUserDetail);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token == null) {
      if (pathName == "/login") {
        router.replace("/login");
        setIsAllowed(true);
      } else {
        router.replace("/login");
        setIsAllowed(false);
      }
    } else if (user.role == USER_ROLES.super_admin.value) {
      if (pathName.includes("login")) {
        router.push("/manage/accounts");
      } else if (pathName.includes("/manage/resources?")) {
        router.push("/manage/resources");
      } else if (pathName.includes("/manage/accounts?")) {
        router.push("/manage/accounts");
      } else if (pathName === "/") {
        router.push("/manage/accounts");
      } else {
        setIsAllowed(true);
      }
    }
  }, [pathName]);

  return isAllowed ? children : <></>;
};

export default RouteGuard;
