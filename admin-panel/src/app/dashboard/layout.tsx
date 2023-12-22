"use client"
import { FaRegNewspaper, FaUsers } from "react-icons/fa6";
import AdminProfile from "./component/AdminProfile";
import Sidebar from "@/components/Sidebar";

export default function AdminPanelLayout({
  children,
  normalFonts = false,
}: {
  children: JSX.Element;
  normalFonts?: boolean;
}) {
  const menuList = [
    {
      name: "Manage Account",
      icon:<FaUsers />,
      key: "userlist",
      url: "/admin/users",
    },
    {
      name: "Manage Resources/ News",
      icon:<FaRegNewspaper />,
      key: "resources",
      url: "/admin/resources",
    },
  ];

  return (
    <div
      className={`flex items-start bg-black h-screen overflow-hidden`}
    >
      <Sidebar menuList={menuList} activePage={"inventory"} />
      <div className="flex flex-col h-screen w-full overflow-auto">
        <AdminProfile />
        {children}
      </div>
    </div>
  );
}
