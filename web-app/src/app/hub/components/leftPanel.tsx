import { NavList } from "@/app/forum/components/sections";
import { Loader } from "@/app/signup/commonBlocks";
import { axiosGet } from "@/axios/config";
import { Button } from "@/components/button";
import { ProgressBar } from "@/components/progressBar";
import { useModal } from "@/hooks";
import {
  removeToken,
  removeUserDetail,
  selectUserDetail,
} from "@/redux/ducks/user.duck";
import { responseCodes } from "@/util/constant";
import { getStaticImageUrl } from "@/util/helpers";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfileDialog } from "./profileDialog";
import { EditProfileDialog } from "./editProfileDialog";
import { AccountSetting } from "./accountSetting";

export const HubLeftPenal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const [userData, setUserData] = useState<UserData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const profileModal = useModal();
  const editProfileModal = useModal();
  const accountSettingModal = useModal();
  const getUserByApi = async () => {
    const userId = loggedInUser?._id;
    if (!userId) return;
    setIsLoading(true);
    await axiosGet(`/user/${userId}/profile`, {
      //   params: {
      //     usePopulate: true,
      //   },
    })
      .then((response) => {
        setIsLoading(false);
        if (response?.status === responseCodes.SUCCESS) {
          setUserData(response?.data?.data?.user);
        }
      })
      .catch((error) => {
        console.log("could not retrieve user profile", error);
        setIsLoading(false);
      });
  };

  const logOutUser = () => {
    dispatch(removeToken());
    dispatch(removeUserDetail());
  };

  useEffect(() => {
    getUserByApi();
  }, []);

  const handleClick = () => {
    axiosGet(`/user/${loggedInUser?._id}/profile?editProfile=true`, {})
      .then((response) => {
        setIsLoading(false);
        if (response?.status === responseCodes.SUCCESS) {
          setUserData((userData: any) => {
            return {
              ...userData,
              certificates: response?.data?.data?.user[0].certificates,
              licenses: response?.data?.data?.user[0].licenses,
            };
          });
        }
        editProfileModal.openModal();
      })
      .catch((error) => {
        console.log("could not retrieve user profile", error);
        setIsLoading(false);
      });
  };
  return (
    <React.Fragment>
      {loggedInUser && (
        <ProfileDialog
          loggedInUser={loggedInUser}
          profileModal={profileModal}
        />
      )}
      {userData && (
        <>
          <EditProfileDialog
            editProfileModal={editProfileModal}
            loggedInUser={loggedInUser}
            userData={userData}
            setUserData={setUserData}
          />
          <AccountSetting
            userData={userData}
            accountSettingModal={accountSettingModal}
          />
        </>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-auto flex-col gap-4">
          <div className="flex justify-center items-center flex-col gap-4">
            {userData?.profile_img && (
              <Image
                className="rounded-lg w-20 h-20 hover:blur-sm transition-all duration-200"
                src={getStaticImageUrl(loggedInUser?.profile_img)}
                alt="user_profile_img"
                width={500}
                height={500}
              />
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium font-headers text-xl">
                Hi, {userData?.first_name}
              </span>
              <FontAwesomeIcon
                onClick={handleClick}
                className="text-eduBlack/60 cursor-pointer"
                icon={faEdit}
              />
            </div>
            <div className="flex gap-2 justify-between">
              <span className="text-base font-light">
                <span className="font-medium">{userData?.followersCount}</span>{" "}
                Followers
              </span>
              <span className="text-base font-light">
                <span className="font-medium">{userData?.followingCount}</span>{" "}
                Following
              </span>
            </div>
            <hr className="w-full border border-eduBlack/40" />
          </div>
          <h3 className="font-headers text-2xl">My EduRx</h3>
          <NavList
            options={[
              {
                label: "Notifications",
                isDefault: true,
                onClick: () => router.push("hub"),
              },
              {
                label: "My Profile",
                onClick: profileModal?.openModal,
              },
              {
                label: "Forum Hub",
                onClick: () => router.push("forum"),
              },
              {
                label: "Resources",
                onClick: () => router.push("resources"),
              },
            ]}
          />
          <hr className="w-full border border-eduBlack/40" />
          <span className="text-base">Coming Soon!</span>
          <div className="flex flex-col gap-2 flex-auto opacity-20 blur-[1px] overflow-y-auto">
            <Button label="Navcess" disabled className="!m-0" />
            <hr className="w-full border border-eduBlack/40" />
            <div className="flex flex-col gap-2 flex-auto">
              <h3 className="font-headers text-2xl">Events</h3>
              <span className="font-medium text-xs">In Person</span>
              <ul className="flex gap-2 opacity-60 flex-col">
                <li className="font-medium text-xs">
                  Title of Event • MM/DD/YYYY • Location
                </li>
              </ul>
              <span className="font-medium text-xs">Virtual</span>
              <ul className="flex gap-2 opacity-60 flex-col">
                <li className="font-medium text-xs">
                  Title of Event • MM/DD/YYYY • Location
                </li>
              </ul>
            </div>
            <ProgressBar
              label="Advanced Practice Certification in Clinical"
              progress={55}
            />
            <ProgressBar
              label="Board Certified Specialist in Obesity and"
              progress={80}
            />
            <ProgressBar label="Medicinal Plant Certificate" progress={25} />
          </div>
          <hr className="w-full border border-eduBlack/40" />
          <NavList
            options={[
              {
                label: "Manage Account",
                onClick: accountSettingModal.openModal,
              },
              {
                label: "Logout",
                onClick: logOutUser,
              },
            ]}
          />
        </div>
      )}
    </React.Fragment>
  );
};
