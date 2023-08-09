import { selectToken, selectUserDetail } from "@/redux/ducks/user.duck";
import { publicRoutes } from "@/util/constant";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const router = useRouter();
  const token = useSelector(selectToken);
  const user = useSelector(selectUserDetail);
  const pathName = usePathname();
  let isAuthorized = true;

  useEffect(() => {
    if (
      (!token || !user?._id) &&
      !publicRoutes.find((route) => route === pathName)
    ) {
      router.push("/");
    } else if (
      token &&
      user?._id &&
      publicRoutes.find((route) => route === pathName)
    ) {
      router.push("/profile");
    }
  }, [token, user]);
  return isAuthorized ? (children as JSX.Element) : <></>;
}
