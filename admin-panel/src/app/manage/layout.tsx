"use client"
import AdminProfile from "@/components/AdminProfile";
import Sidebar from "@/components/Sidebar";
import { FaRegNewspaper, FaUsers } from "react-icons/fa6";

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
      url: "/manage/accounts",
    },
    {
      name: "Manage Resources/ News",
      icon:<FaRegNewspaper />,
      key: "resources",
      url: "/manage/resources",
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
