"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  About,
  Activity,
  BasicInfo,
  Documents,
  Education,
  ModalFooter,
  ModalHeader,
} from "../sections";
import { axiosGet } from "@/axios/config";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks";
import EditProfile from "./edit";
import NotFound from "@/app/not-found";

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

export const UserProfile = ({
  userId,
  isSelfProfile,
}: {
  userId: string;
  isSelfProfile?: boolean;
}) => {
  const [userData, setUserData] = useState<UserData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const editModal = useModal();

  const loadMoreDocuments = async (doc_type: "license" | "certificate") => {
    try {
      setIsLoading(true);
      const result = await axiosGet(`/user/${userId}/documents`, {
        params: {
          doc_type,
          page: currentPage[doc_type] + 1,
        },
      });
      let key: keyof UserData =
        doc_type === "license" ? "licenses" : "certificates";
      let oldDocs = userData?.[key] || [];
      if (result?.status === 200) {
        setUserData((preData: any) => {
          return {
            ...preData,
            [key]: [...oldDocs, ...result?.data?.data?.records],
          };
        });
        setCurrentPage((prePages) => {
          return {
            ...prePages,
            [doc_type]: result?.data?.data?.currentPage,
          };
        });
      }
      setTimeout(() => {
        lastDocRef?.[key as keyof typeof lastDocRef]?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      console.log("Error loading more documents", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    axiosGet(`/user/${userId}/profile`, {
      params: {
        usePopulate: true,
      },
    })
      .then((response) => {
        if (response?.status === 200) {
          setUserData(response?.data?.data?.user);
        }
      })
      .catch((error) => console.log("could not retrieve user profile", error));
  }, [userId]);

  if (!userData) return <NotFound />;
  return (
    <>
      <Modal
        visible={editModal.isOpen}
        onClose={editModal.closeModal}
        closeOnOutsideClick
        modalClassName="!w-2/4 !bg-primary-dark h-full"
        modalBodyClassName="flex flex-auto p-4 !h-full overflow-y-auto"
        customHeader={
          <ModalHeader
            closeModal={editModal.closeModal}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
          />
        }
        customFooter={
          <ModalFooter
            currentSection={currentSection}
            isLoading={isLoading}
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
          setIsListView={setIsListView}
          isListView={isListView}
        />
      </Modal>
      <div className="flex justify-center w-full items-center flex-col">
        <div className="m-auto p-4 flex-auto lg:w-3/4 flex gap-4 h-auto w-full flex-col">
          <BasicInfo
            userData={userData}
            openModal={isSelfProfile ? editModal.openModal : undefined}
            buttonJsx={
              !isSelfProfile && (
                <div className="justify-self-end self-end">
                  <button
                    type="button"
                    className="border rounded-md p-2 hover:bg-primary w-auto px-4 font-medium text-sm text-primary border-primary bg-primary/10 hover:text-white transition-all ease-in-out duration-300"
                    // onClick={} // TODO: follow / un-follow user interaction
                  >
                    Follow {userData?.first_name}
                  </button>
                </div>
              )
            }
          />
          <About
            openModal={isSelfProfile ? editModal.openModal : undefined}
            personal_bio={userData?.personal_bio}
            emptyBioMessage={
              isSelfProfile
                ? "You don't have about / bio yet."
                : "This user has not shared their about / bio yet."
            }
          />
          <Activity
            posts={userData?.userPosts}
            comments={userData?.recentComments}
            profileImage={userData?.profile_img}
            noPostMessage={
              isSelfProfile
                ? "You have no forum posts yet."
                : "This user has no forum posts yet."
            }
            noCommentMessage={
              isSelfProfile
                ? "You have no forum comments yet."
                : "This user has no forum comments yet."
            }
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
                ? "You have not shared any education hisory yet."
                : "This user has not shared their education hisory yet."
            }
          />
          <Documents
            userData={userData}
            isLoading={isLoading}
            lastDocRef={lastDocRef}
            onLoadMore={loadMoreDocuments}
            noDataMessage={
              isSelfProfile
                ? "You have not shared any {type} yet."
                : "This user has not shared their {type} yet."
            }
            onEditClick={
              isSelfProfile
                ? () => {
                    setCurrentSection?.("certifications");
                    editModal.openModal();
                  }
                : undefined
            }
          />
        </div>
      </div>
    </>
  );
};
