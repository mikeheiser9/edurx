"use client";
import React from "react";
import EduRxIcon from "../assets/icons/eduRx-black.svg";
import {
  removeToken,
  removeUserDetail,
  selectUserDetail,
} from "@/redux/ducks/user.duck";
import { getStaticImageUrl } from "@/util/helpers";
import {
  faGear,
  faSignOut,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useOutsideClick } from "@/hooks";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { DropDownPopover } from "@/app/forum/components/sections";

const tabMenuOptions = [
  { label: "Hub", img: EduRxIcon, path: "hub" },
  { label: "Forum", path: "forum" },
  { label: "Resources", path: "resorces" },
  { label: "Events", isDisabled: true },
  { label: "EduRx Library", isDisabled: true },
  { label: "Health Check", isDisabled: true },
];

const HeaderNav = () => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();
  // const isSamePath: boolean = tabMenuOptions?.some(
  //   (i) => i?.path && location.pathname.includes(i?.path)
  // );
  const loggedInUser = useSelector(selectUserDetail);
  const [showDropdown, setshowDropdown] = useState<boolean>(false);
  const dropDownRef = useOutsideClick(() => setshowDropdown(false));
  const logOutUser = () => {
    dispatch(removeUserDetail());
    dispatch(removeToken());
  };

  const onNavigate = (item: any) => {
    if (!item?.path || item?.isDisabled) return;

    router.push(item.path);
  };

  return (
    <nav className="flex relative gap-8 p-4 justify-center rounded-md">
      {tabMenuOptions.map((item, index: number) => (
        <button
          key={index}
          onClick={() => onNavigate(item)}
          className={`text-eduBlack duration-300 py-2 ease-in-out transition-colors text-[16px] rounded-[5px] font-semibold px-4 w-[145px] text-center cursor-pointer disabled:opacity-60 ${
            pathName === `/${item?.path}`
              ? "bg-eduBlack text-white"
              : "bg-eduDarkGray"
          }`}
          type="button"
          disabled={item?.isDisabled}
        >
          <span className="flex items-center justify-center font-semibold gap-1">
            {item?.img && (
              <Image
                src={item?.img}
                alt={item?.label}
                className={`w-6 h-6 transition-all duration-300 ${
                  pathName === `/${item?.path}` && "invert"
                }`}
                height={200}
                width={200}
              />
            )}
            {item?.label}
          </span>
        </button>
      ))}
      <div
        className={`absolute transition-colors rounded-md ease-in-out duration-100 p-2 z-40 flex gap-2 flex-col right-4 ${
          showDropdown ? "bg-primary-darker" : "bg-transparent"
        }`}
        ref={dropDownRef}
      >
        <div className="flex justify-end">
          <span
            onClick={() => setshowDropdown(!showDropdown)}
            className={`flex ease-in-out duration-500 cursor-pointer ring-eduBlack overflow-hidden w-8 h-8 justify-center items-center rounded-full bg-eduDarkGray ${
              showDropdown ? "shadow-[0px_0px_5px] shadow-black" : ""
            }`}
          >
            {loggedInUser?.profile_img ? (
              <Image
                src={getStaticImageUrl(loggedInUser?.profile_img)}
                alt="user_profile_img"
                width={100}
                height={100}
              />
            ) : (
              <FontAwesomeIcon icon={faUserAlt} />
            )}
          </span>
        </div>
        <DropDownPopover
          itemClassName="px-1 text-sm flex items-center gap-2 cursor-pointer"
          isVisible={showDropdown}
          options={[
            {
              label: "Profile",
              icon: faUserAlt,
              onClick: () => router.push("profile"),
            },
            {
              label: "Notifications",
              icon: faBell,
            },
            {
              label: "Account",
              icon: faGear,
            },
            {
              label: "Logout",
              icon: faSignOut,
              onClick: logOutUser,
            },
          ]}
        />
      </div>
    </nav>
  );
};

export default HeaderNav;
