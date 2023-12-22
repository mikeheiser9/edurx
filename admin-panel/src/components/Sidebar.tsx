"use client"
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FaGreaterThan, FaLessThan } from "react-icons/fa6";

const Sidebar = (props:any) => {
  const { menuList } = props;
  const router = useRouter();
  const path = usePathname();;
  const hideSidebar = path.includes("login");
  const [collapse, setCollapse] = useState(false);
  const active:any = menuList.filter((_:any, i:number) => {
    return path == menuList[i].url && menuList[i];
  });
  const [activePage, setActivePage] = useState(!hideSidebar && active[0] && active[0].key);
  useEffect(() => {
    setActivePage(!hideSidebar && active[0] &&  active[0].key);
  }, [hideSidebar]);

  return (
    !hideSidebar && (
      <div
        className={`relative h-screen p-4 ${
          collapse ? "w-[76px]" : "w-[350px]"
        } text-center bg-[#A5A5A8] transition-all`}
      >
        <button
          type="button"
          onClick={() => setCollapse(!collapse)}
          className="absolute text-gray top-10 -right-3.5 h-7 w-7 rounded-full bg-white border-[3px] border-zinc-300 flex items-center justify-center"
        >
        {collapse ?
          (<FaGreaterThan className="text-gray-500 text-xs font-semibold p-[1px]"  />)
        : (<FaLessThan className="text-gray-500 text-xs font-semibold p-[1px]"  />)
        }
        </button>
        <div className="font-bold text-black text-left mb-4 flex items-center whitespace-nowrap overflow-hidden">
            <img
              src="/assets/edurx.svg"
              className=" h-20 w-20 mx-auto rounded-full"
              alt=""
            />
          
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-[calc(100vh-78px)]">
          {menuList.map((items:any, i:number) => (
            <Link href={items.url} key={i}>
              <div
                key={i}
                onClick={() => setActivePage(items.key)}
                className={`h-11 flex items-center rounded-md duration-300 cursor-pointer whitespace-nowrap ${
                  items.key === activePage
                    ? "bg-red-500 text-white"
                    : "hover:bg-[#FDCD26]"
                }`}
              >
                <span className="w-11 min-w-[44px] relative flex items-center justify-center">
                  {items.icon}
                </span>
                <span className="pl-0.5text-[15px] font-bold">
                  {items.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default Sidebar;
