import { NavList } from "@/app/forum/components/sections";
import EditProfile from "@/app/profile/components/edit";
import { UserProfile } from "@/app/profile/components/profile";
import { ModalFooter, ModalHeader } from "@/app/profile/sections";
import { Loader } from "@/app/signup/commonBlocks";
import { axiosGet } from "@/axios/config";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { ProgressBar } from "@/components/progressBar";
import { showToast } from "@/components/toast";
import { useModal } from "@/hooks";
import {
  removeToken,
  removeUserDetail,
  selectUserDetail,
} from "@/redux/ducks/user.duck";
import { responseCodes } from "@/util/constant";
import { getStaticImageUrl } from "@/util/helpers";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface LastDocRefType {
  licenses: React.RefObject<HTMLDivElement> | null;
  certificates: React.RefObject<HTMLDivElement> | null;
}

const profileSections: profileSections = {
  about: "About",
  education: "Education",
  certifications: "Certifications",
  licenses: "Licenses",
  profileImages: "Profile Images",
};

export const HubLeftPenal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const [userData, setUserData] = useState<UserData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentSection, setCurrentSection] = useState<keyof profileSections>(
    Object.keys(profileSections)[0] as keyof profileSections
  );
  const [isListView, setIsListView] = useState<boolean>(true);
  const [isDocsLoading, setIsDocsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<{
    license: number;
    certificate: number;
  }>({
    license: 1,
    certificate: 1,
  });
  const lastDocRef: LastDocRefType = {
    licenses: useRef<HTMLDivElement>(null),
    certificates: useRef<HTMLDivElement>(null),
  };
  const profileModal = useModal();
  const editProfileModal = useModal();

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

  const loadMoreDocuments = async (doc_type: "license" | "certificate") => {
    try {
      setIsDocsLoading(true);
      const result = await axiosGet(`/user/${loggedInUser?._id}/documents`, {
        params: {
          doc_type,
          page: currentPage[doc_type] + 1,
        },
      });
      let key: keyof UserData =
        doc_type === "license" ? "licenses" : "certificates";
      let oldDocs = userData?.[key] || [];
      if (result?.status === responseCodes.SUCCESS) {
        setUserData((preData) => {
          return {
            ...(preData as UserData),
            [key]: [...oldDocs, ...result?.data?.data?.records],
          };
        });
        setCurrentPage((prePages) => {
          return {
            ...prePages,
            [doc_type]: result?.data?.data?.currentPage,
          };
        });
        setTimeout(() => {
          lastDocRef?.[key as keyof typeof lastDocRef]?.current?.scrollIntoView(
            {
              behavior: "smooth",
            }
          );
        }, 100);
      } else throw new Error("Something went wrong");
    } catch (err) {
      showToast.error("Unable to more documents");
      console.log("Error loading more documents", err);
    } finally {
      setIsDocsLoading(false);
    }
  };

  const logOutUser = () => {
    dispatch(removeToken());
    dispatch(removeUserDetail());
  };

  useEffect(() => {
    getUserByApi();
  }, []);

  return (
    <React.Fragment>
      <Modal visible={profileModal.isOpen} onClose={profileModal.closeModal}>
        <UserProfile userId={loggedInUser?._id} />
      </Modal>
      {userData && (
        <Modal
          visible={editProfileModal.isOpen}
          onClose={editProfileModal.closeModal}
          closeOnOutsideClick
          modalClassName="!w-2/5"
          modalBodyClassName="flex flex-auto p-4 !h-full overflow-y-auto"
          customHeader={
            <ModalHeader
              closeModal={editProfileModal.closeModal}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            />
          }
          customFooter={
            <ModalFooter
              currentSection={currentSection}
              isLoading={isDocsLoading}
              onLoadMore={loadMoreDocuments}
              userData={userData}
              isListView={isListView}
            />
          }
        >
          <EditProfile
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            profileSections={profileSections}
            userData={userData}
            setUserData={setUserData}
            editModal={editProfileModal}
            setIsListView={setIsListView}
            isListView={isListView}
          />
        </Modal>
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
                onClick={editProfileModal.openModal}
                className="text-eduBlack/60"
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
                onClick() {},
              },
              {
                label: "My Profile",
                onClick: () => profileModal?.openModal(),
              },
              {
                label: "Forum Hub",
                onClick: () => router.push("forum"),
              },
              {
                label: "Resources",
                // onClick: () => router.push("resources"),
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
                onClick() {},
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
