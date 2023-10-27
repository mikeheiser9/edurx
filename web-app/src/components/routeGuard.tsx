import { selectToken, selectUserDetail } from "@/redux/ducks/user.duck";
import { publicRoutes } from "@/util/constant";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "./dashboardLayout";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const router = useRouter();
  const token = useSelector(selectToken);
  const user = useSelector(selectUserDetail);
  const pathName = usePathname();
  const customLayoutPaths = ["/forum", "/hub", "/resource"]; // IF path includes one of these then use custom layout
  const useCustomLayout = customLayoutPaths?.some(
    (path: string) => path === pathName
  );

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
      router.push("/forum");
    }
  }, [token, user]);

  return useCustomLayout ? (
    <DashboardLayout>{children}</DashboardLayout>
  ) : (
    (children as JSX.Element)
  );
}
