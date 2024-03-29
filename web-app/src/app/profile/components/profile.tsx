"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  About,
  Activity,
  BasicInfo,
  CertificateAndLicense,
  Education,
  ModalFooter,
  ModalHeader,
} from "../sections";
import { axiosGet } from "@/axios/config";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks";
import EditProfile from "./edit";
import { InternalError } from "@/components/internalError";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { Loader } from "@/app/signup/commonBlocks";
import { addRemoveUserConnectionByAPI } from "@/service/user.service";
import { profileSections, responseCodes } from "@/util/constant";
import { showToast } from "@/components/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import UnFollowConfirmation from "@/app/forum/components/unFollowConfirmation";
interface LastDocRefType {
  licenses: React.RefObject<HTMLDivElement> | null;
  certificates: React.RefObject<HTMLDivElement> | null;
}

const countContributors = (array: any[], primaryKey: string): number => {
  const uniqueValues = new Set();
  array.forEach((item) => {
    if (item[primaryKey]) {
      uniqueValues.add(item[primaryKey]);
    }
  });
  return uniqueValues.size;
};

export const UserProfile = ({ userId, profileModal, setSelectedPostId }: { userId: string, profileModal?: UseModalType, setSelectedPostId?: React.Dispatch<React.SetStateAction<string>> }) => {
  const [userData, setUserData] = useState<UserData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDocsLoading, setIsDocsLoading] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<keyof profileSections>(
    Object.keys(profileSections)[0] as keyof profileSections
  );
  const [currentPage, setCurrentPage] = useState<{
    license: number;
    certificate: number;
  }>({
    license: 1,
    certificate: 1,
  });
  const [isListView, setIsListView] = useState<boolean>(true);
  const lastDocRef: LastDocRefType = {
    licenses: useRef<HTMLDivElement>(null),
    certificates: useRef<HTMLDivElement>(null),
  };
  const loggedInUser = useSelector(selectUserDetail);
  const isSelfProfile = loggedInUser?._id === userId;
  const isFollowing = userData?.followers?.some(
    (followers) => followers?.userId === loggedInUser?._id
  );
  const [buttonText, setButtonText] = useState("Following");
  const editModal = useModal();
  const [saveAndExitButtonPressed, setSaveAndExitButtonPressed] =
    useState(false);
  const unFollowPostConfirmationModel = useModal();

  const loadMoreDocuments = async (doc_type: "license" | "certificate") => {
    try {
      setIsDocsLoading(true);
      const result = await axiosGet(`/user/${userId}/documents`, {
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

  const addRemoveConnection = async (type: "add" | "remove") => {
    try {
      const payload = {
        userId: loggedInUser?._id,
        targetUserId: userId,
      };
      const response = await addRemoveUserConnectionByAPI(type, payload);
      if (response.status === responseCodes.SUCCESS) {
        setUserData((preState) => {
          let followersCount = preState?.followersCount || 0;
          type === "add" ? (followersCount += 1) : (followersCount -= 1);
          return {
            ...(preState as UserData),
            followers: type === "add" ? [response.data?.data] : [],
            followersCount,
          };
        });
        // showToast?.[type == "add" ? "success" : "error"]?.(message);
        type == "remove" && unFollowPostConfirmationModel.closeModal()
      } else {
        throw Error(`Unable to ${type} connection`);
      }
    } catch (error) {
      // showToast.error((error as Error)?.message || "Something went wrong");
      console.log(`Unable to ${type} connection`, error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    axiosGet(`/user/${userId}/profile`, {
      params: {
        usePopulate: true,
      },
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
  }, [userId]);
  const Header = () => (
    <div className="flex p-2 gap-2 bg-eduDarkGray">
      <span className="text-base text-center flex-1">Confirmation</span>
      <FontAwesomeIcon
        icon={faX}
        onClick={unFollowPostConfirmationModel.closeModal}
        className="ml-auto font-bold self-center cursor-pointer text-eduBlack"
      />
    </div>
  );
  return (
    <React.Fragment>
      {isLoading ? (
        <div className="flex justify-center flex-auto h-screen items-center">
          <Loader />
        </div>
      ) : (
        <>
          {!userData ? (
            <InternalError />
          ) : (
            <>
              <Modal
                visible={editModal.isOpen}
                onClose={editModal.closeModal}
                closeOnOutsideClick
                modalClassName="md:w-[660px]"
                modalBodyClassName="flex flex-auto p-4 !h-full overflow-y-auto"
                customHeader={
                  <ModalHeader
                    closeModal={editModal.closeModal}
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                    setIsListView={setIsListView}
                  />
                }
                customFooter={
                  <ModalFooter
                    currentSection={currentSection}
                    isLoading={isDocsLoading}
                    onLoadMore={loadMoreDocuments}
                    userData={userData}
                    isListView={isListView}
                    setSaveAndExitButtonPressed={setSaveAndExitButtonPressed}
                    setCurrentSection={setCurrentSection}
                    closeModal={editModal.closeModal}
                  />
                }
              >
                <EditProfile
                  currentSection={currentSection}
                  setCurrentSection={setCurrentSection}
                  profileSections={profileSections}
                  userData={userData}
                  setUserData={setUserData}
                  setIsListView={setIsListView}
                  isListView={isListView}
                  editModal={editModal}
                  saveAndExitButtonPressed={saveAndExitButtonPressed}
                  setSaveAndExitButtonPressed={setSaveAndExitButtonPressed}
                />
              </Modal>

              <Modal
                onClose={unFollowPostConfirmationModel.closeModal}
                visible={unFollowPostConfirmationModel.isOpen}
                customHeader={<Header />}
                showCloseIcon
                modalClassName="!w-auto min-w-[30rem] !rounded-lg"
                modalBodyClassName="bg-white"
                showFooter={false}
                closeOnEscape
                closeOnOutsideClick
              >
                <UnFollowConfirmation
                  unFollowPost={() => addRemoveConnection("remove")}
                  modelClosingFunction={
                    unFollowPostConfirmationModel.closeModal
                  }
                  confirmationLabel={`Are you sure you want to unfollow ${userData.first_name + "_" + userData.last_name}`}
                />
              </Modal>
              <div className="flex justify-center w-full items-center flex-col">
                <div className="m-auto flex-auto flex gap-4 h-auto w-full flex-col">
                  <BasicInfo
                    userData={userData}
                    openModal={isSelfProfile ? editModal.openModal : undefined}
                    buttonJsx={
                      !isSelfProfile ? (
                        <div className="justify-self-end self-start">
                          <button
                            type="button"
                            className={`border rounded-md py-2 px-6 font-body text-sm min-w-[8rem] border-eduBlack  transition-colors ease-in-out duration-300 capitalize ${isFollowing
                              ? "bg-eduLightBlue text-white hover:bg-eduLightGray hover:text-black"
                              : "hover:text-white hover:bg-eduBlack"
                              }`}
                            onMouseEnter={() => setButtonText("Unfollow")}
                            onMouseLeave={() => setButtonText("Following")}
                            onClick={() =>
                              isFollowing ? unFollowPostConfirmationModel.openModal() : addRemoveConnection("add")
                            }
                          >
                            {isFollowing ? buttonText : `Follow `}
                          </button>
                        </div>
                      ) : undefined
                    }
                  />
                  
                  <About
                    openModal={isSelfProfile ? editModal.openModal : undefined}
                    personal_bio={userData?.personal_bio}
                    emptyBioMessage={
                      isSelfProfile ? "You has no About yet." : `${userData.username} has no about yet`
                    }
                  />
                  <Activity
                    posts={userData?.userPosts}
                    comments={userData?.recentComments}
                    profileImage={userData?.profile_img}
                    noPostMessage={
                      isSelfProfile
                        ? "You has no forum posts yet."
                        : `${userData.username} has no about yet`
                    }
                    noCommentMessage={
                      isSelfProfile
                        ? "You has no forum comments yet."
                        : `${userData.username} has no about yet`
                    }
                    profileModal={profileModal}
                    setSelectedPostId={setSelectedPostId as React.Dispatch<React.SetStateAction<string>>}
                  />
                  <Education
                    educations={userData.educations}
                    onEditClick={
                      isSelfProfile
                        ? () => {
                          setCurrentSection?.("education");
                          editModal.openModal();
                        }
                        : undefined
                    }
                    noEducationMessage={
                      isSelfProfile
                        ? "You has not shared any education history yet."
                        : `${userData.username}  has not shared their education history yet.`
                    }
                  />
                  <CertificateAndLicense
                    userData={userData}
                    lastDocRef={lastDocRef}
                    type="certificates"
                    noDataMessage={isSelfProfile
                      ? "You has not shared any {type} yet."
                      : `${userData.username}  has not shared their {type} yet.`}
                    onEditClick={
                      isSelfProfile
                        ? () => {
                          setCurrentSection?.("certifications");
                          editModal.openModal();
                        }
                        : undefined
                    }
                    isLoading={isDocsLoading}
                    onLoadMore={()=>loadMoreDocuments("certificate")}
                  />
                  <CertificateAndLicense
                    userData={userData}
                    lastDocRef={lastDocRef}
                    type="licenses"
                    noDataMessage={isSelfProfile
                      ? "You has not shared any {type} yet."
                      : `${userData.username}  has not shared their {type} yet.`}
                    onEditClick={
                      isSelfProfile
                        ? () => {
                          setCurrentSection?.("licenses");
                          editModal.openModal();
                        }
                        : undefined
                    }
                    isLoading={isDocsLoading}
                    onLoadMore={()=>loadMoreDocuments("license")}
                  />
                </div>
                </div>
            </>
          )}
        </>
      )}
    </React.Fragment>
  );
};
