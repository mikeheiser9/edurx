"use client";
import React from "react";
import EduRxIcon from "../assets/icons/eduRx-black.svg";
import HubMobileIcon from "../assets/icons/hubMobileIcon.svg";
import HubMobileIconActive from "../assets/icons/hubMobileIcon-active.svg";
import ForumMobileIcon from "../assets/icons/forumMobileIcon.svg";
import ForumMobileIconActive from "../assets/icons/forumMobileIcon-active.svg";
import NewPostMobileIcon from "../assets/icons/newPostMobileIcon.svg";
import NewPostMobileIconActive from "../assets/icons/newPostMobileIcon-active.svg";
import ResourcesMobileIcon from "../assets/icons/ResourcesMobileIcon.svg";
import ResourcesMobileIconActive from "../assets/icons/ResourcesMobileIcon-active.svg";
import {
  removeToken,
  removeUserDetail,
  selectUserDetail,
} from "@/redux/ducks/user.duck";
import { getStaticImageUrl } from "@/util/helpers";
import {
  faChevronRight,
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
import { setModalState } from "@/redux/ducks/modal.duck";

const tabMenuOptions = [
  { label: "Hub", img: EduRxIcon, path: "hub" },
  { label: "Forum", path: "forum" },
  { label: "Resources", path: "resources" },
  { label: "EduRx Library", isDisabled: true },
  { label: "Events", isDisabled: true },
  { label: "Health Check", isDisabled: true },
];

const tabMenuOptionsForMobile=[
  { label: "Hub", img: EduRxIcon, path: "hub",activeIcon:HubMobileIconActive,inActiveIcon:HubMobileIcon },
  { label: "Forum", path: "forum" ,activeIcon:ForumMobileIconActive,inActiveIcon:ForumMobileIcon},
  { label: "New Post", path: "" ,activeIcon:NewPostMobileIconActive,inActiveIcon:NewPostMobileIcon},
  { label: "Resources", path: "resources" ,activeIcon:ResourcesMobileIconActive,inActiveIcon:ResourcesMobileIcon},
]

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
    if(item.label=="New Post")
    {

    }
    else{
      router.push(item.path);
    }
  };

  const returnAppropriateClass = (path: string | undefined) => {
    return pathName === "/" + path ? "!bg-white" : "!bg-black";
  };

  console.log({tabMenuOptionsForMobile,pathName});
  
  return (
    <>
    <div className="nav-header relative x-large:pr-2 pl-4 ipad-under:p-4 ipad-under:pl-0 ipad-under:flex ipad-under:justify-between ipad-under:pr-11">
    <div className="toogle-open hidden ipad-under:block">
              <span className="bg-eduLightBlue w-12 h-10  rounded-[3px] rounded-l-none flex items-center justify-center text-white">
              <FontAwesomeIcon
                  className="text-white cursor-pointer text-2xl"
                  icon={faChevronRight}
                />
              </span>
           </div>
           <div className="logo-mobile hidden ipad-under:block ipad-under:mx-auto">
            <a href="#"><img src="https://i.ibb.co/gwRZ6gm/edu-Rx-blue-1.png" alt="edu-Rx-blue-1" /></a>
           </div>
           {loggedInUser && (
        <ProfileDialog
          loggedInUser={loggedInUser}
          profileModal={profileModal}
        />
      )}
      <nav className="flex ipad-under:hidden relative  gap-4  justify-start rounded-md 2xl:pr-[70px] 2xl:justify-center max-w-[calc(100%_-_70px)] overflow-auto x-large:justify-start">
        {tabMenuOptions.map((item, index: number) => (
          <button
            key={index}
            onClick={() => onNavigate(item)}
            className={`text-eduBlack duration-300 py-2  whitespace-nowrap large:min-w-[145px] min-w-[140px] ease-in-out transition-colors text-[16px] rounded-[5px] font-semibold px-4 2xl:w-[145px] text-center cursor-pointer ${
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
              <div className="flex  text-center  items-center justify-between relative">
              <div
                className={`w-[40px] h-[28px] relative -ml-1.5 ${
                  pathName === "/" + item?.path
                    ? "border-r-white"
                    : "border-r-black"
                } grid grid-cols-2 gap-1`}
              >
                <span
                  className={`w-[10px] h-[10px] t-l absolute left-0 top-0 rounded-full ${returnAppropriateClass(
                    item?.path
                  )}`}
                ></span>
                <span
                  className={`w-[10px] h-[10px] absolute left-0 bottom-0 rounded-full ${returnAppropriateClass(
                    item?.path
                  )}`}
                ></span>
                <span
                  className={`w-[10px] h-[10px] rounded-full absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  ${returnAppropriateClass(
                    item?.path
                  )} `}
                ></span>
                <span
                  className={`w-[10px] h-[10px] rounded-full absolute right-0 top-0 ${returnAppropriateClass(
                    item?.path
                  )} `}
                ></span>
                <span
                  className={`w-[10px] h-[10px] rounded-full absolute right-0 bottom-0 ${returnAppropriateClass(
                    item?.path
                  )}`}
                ></span>
              </div>

              <span
                className={`absolute h-[44px] top-[-8px] left-[44px]  border-r-2 ${
                  pathName === "/" + item?.path
                    ? "border-r-white"
                    : "border-r-black"
                }`}
              ></span>
              <div className="flex items-center">
              <span
                className={`rotate-[-90deg] text-[9px] ${
                  pathName === "/" + item?.path
                    ? "border-white"
                    : "border-black"
                } border-solid border-[1px] h-[14px] w-[20px] text-center`}
              >
                RX
              </span>
              <span className="ml-1">{item.label}</span>
              </div>
            </div>
            )}
          </button>
        ))}
      </nav>
      <div
        className={`absolute transition-colors rounded-md ease-in-out duration-100 p-1 z-40 flex gap-2 flex-col top-0 ipad-under:top-4 right-4 ipad-under:p-0 ${
          showDropdown ? "bg-primary-darker" : "bg-transparent"
        }`}
        ref={dropDownRef}
      >
          <div className="flex justify-end">
            <span
              onClick={() => setshowDropdown(!showDropdown)}
              className={`flex ease-in-out duration-500 cursor-pointer ring-eduBlack overflow-hidden w-10 h-10 ipad-under:w-10 ipad-under:h-10 justify-center items-center rounded-full bg-eduDarkGray ${
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
                onClick: () => router?.push("/hub"),
              },
              {
                label: "Account",
                icon: faGear,
                onClick: () =>
                  dispatch(
                    setModalState({ isOpen: true, type: "accountSettingModal" })
                  ),
              },
              {
                label: "Logout",
                icon: faSignOut,
                onClick: logOutUser,
              },
            ]}
          />
        </div>
    </div>
   
    <div className="mobile-bottom-menu hidden ipad-under:block">
    <nav className="fixed bottom-0 inset-x-0 bg-white flex justify-between text-sm text-eduLightBlue capitalize">
    {tabMenuOptionsForMobile.map((menu)=>{
return (
  <div
    className="w-full flex-col justify-between pt-4 pb-3 px-3 text-center flex items-center"
    onClick={()=>onNavigate(menu)}
  > <div className="min-h-[30px] relative flex flex-wrap items-center mb-1">
     {menu.label=="hub" &&<span className="count-mobile flex leading-normal items-center justify-center min-w-[14px] min-h-[14px] text-[8px] bg-primary text-eduBlack font-medium absolute rounded-full -top-2 -right-2">4</span>}
     <Image  src={ pathName.substring(1) == menu?.path ? menu.activeIcon :menu.inActiveIcon}
                  alt={"alternative"}
                  className=""
                />
                </div>
    <span className={`text-[11px]  ${pathName.substring(1) == menu?.path ?'font-semibold' : '' }`}>{menu.label}</span>
  </div>
)
    })}
  {/* <a
    href="#"
    className="w-full flex-col justify-between pt-4 pb-3 px-3 text-center flex items-center"
  >
    <div className="min-h-[30px] relative flex flex-wrap items-center mb-1">
     
    <Image  src={ForumMobileIcon}
                  alt={ForumMobileIcon}
                  className=""
                />
                </div>
     <span className="text-[11px]">Forum</span>
  </a>
  <a
    href="#"
    className="w-full flex-col justify-between pt-4 pb-3 px-3 text-center flex items-center"
  >
     <div className="min-h-[30px] relative flex flex-wrap items-center mb-1">
   <Image
                  src={NewPostMobileIcon}
                    
                  alt={NewPostMobileIcon}
                  className=""
                />
                </div>
    
    <span className="text-[11px]">New Post</span>
  </a>
  <a
    href="#"
    className="w-full flex-col justify-between pt-4 pb-3 px-3 text-center flex items-center"
  >
    <div className="min-h-[30px] relative flex flex-wrap items-center mb-1">
   <Image
                  src={ResourcesMobileIcon}
                    
                  alt={ResourcesMobileIcon}
                  className=""
                />
                </div>
    
    <span className="text-[11px]">Resources</span>
  </a> */}
</nav>
    </div>
    </>
  );
};

export default HeaderNav;
