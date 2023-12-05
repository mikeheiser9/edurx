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
import { useModal, useOutsideClick } from "@/hooks";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { DropDownPopover } from "@/app/forum/components/sections";
import { ProfileDialog } from "@/app/hub/components/profileDialog";

const tabMenuOptions = [
  { label: "Hub", img: EduRxIcon, path: "hub" },
  { label: "Forum", path: "forum" },
  { label: "Resources", path: "resources" },
  { label: "Events", isDisabled: true },
  { label: "EduRx Library", isDisabled: true },
  { label: "Health Check", isDisabled: true },
];

const HeaderNav = () => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const [showDropdown, setshowDropdown] = useState<boolean>(false);
  const dropDownRef = useOutsideClick(() => setshowDropdown(false));
  const profileModal = useModal();
  const logOutUser = () => {
    dispatch(removeUserDetail());
    dispatch(removeToken());
  };

  const onNavigate = (item: any) => {
    if (!item?.path || item?.isDisabled) return;

    router.push(item.path);
  };

  const returnAppropriateClass = (path: string | undefined) => {
    return pathName === "/" + path ? "!bg-white" : "!bg-black";
  };

  return (
    <nav className="flex relative gap-8 p-4 justify-center rounded-md">
      {loggedInUser && (
        <ProfileDialog
          loggedInUser={loggedInUser}
          profileModal={profileModal}
        />
      )}
      {tabMenuOptions.map((item, index: number) => (
        <button
          key={index}
          onClick={() => onNavigate(item)}
          className={`text-eduBlack duration-300 py-2 ease-in-out transition-colors text-[16px] rounded-[5px] font-semibold px-4 w-[145px] text-center cursor-pointer ${
            item?.isDisabled && "!cursor-not-allowed"
          } disabled:opacity-60 ${
            pathName === `/${item?.path}`
              ? "bg-eduBlack text-white"
              : "bg-eduDarkGray"
          } `}
          type="button"
          disabled={item?.isDisabled}
        >
          {item.label != "Hub" ? (
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
          ) : (
            <div className="flex justify-center text-center">
              <span
                className={`w-1/3  ${
                  pathName === "/" + item?.path
                    ? "border-r-white"
                    : "border-r-black"
                } grid grid-cols-2 gap-1`}
              >
                <span
                  className={`w-[7px] h-[7px] rounded ${returnAppropriateClass(
                    item?.path
                  )}`}
                ></span>
                <span
                  className={`w-[7px] h-[7px] rounded ${returnAppropriateClass(
                    item?.path
                  )}`}
                ></span>
                <span
                  className={`w-[7px] h-[7px] rounded ${returnAppropriateClass(
                    item?.path
                  )}  ml-[10px]`}
                ></span>
                <span
                  className={`w-[7px] h-[7px] rounded ${returnAppropriateClass(
                    item?.path
                  )} relative top-[11px]`}
                ></span>
                <span
                  className={`w-[7px] h-[7px] rounded ${returnAppropriateClass(
                    item?.path
                  )}`}
                ></span>
              </span>

              <span
                className={`absolute h-[45px] top-[16px] mr-[27px] border-r-2 ${
                  pathName === "/" + item?.path
                    ? "border-r-white"
                    : "border-r-black"
                }`}
              ></span>
              <span
                className={`ml-2 rotate-[-90deg] text-[0.7em] ${
                  pathName === "/" + item?.path
                    ? "border-white"
                    : "border-black"
                } border-solid border-[1px] h-[100%] w-[20px] mt-[4px] text-center`}
              >
                RX
              </span>
              <span className="ml-1">{item.label}</span>
            </div>
          )}
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
              onClick: () => profileModal.openModal(),
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
