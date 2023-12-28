"use client";
import { selectToken, selectUserDetail } from "@/redux/ducks/user.duck";
import { USER_ROLES } from "@/util/constant";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RouterGard = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [access, setAccess] = useState(false);
  const user = useSelector(selectUserDetail);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (user && user.role === USER_ROLES.super_admin && token) {
      router.push("/manage/accounts");
    } else {
      router.push("/login");
    }
    setAccess(true);
  }, [pathName]);

  if (access) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};
export default RouterGard;
