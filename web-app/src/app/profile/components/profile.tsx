"use client";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
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
  viewMode,
}: {
  userId: string;
  viewMode?: boolean;
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

  if (!userData) return <></>;
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
          loggedInUser={userId}
        />
      </Modal>
      <div className="flex justify-center w-full items-center flex-col">
        <div className="m-auto p-4 flex-auto lg:w-3/4 flex gap-4 h-auto w-full flex-col">
          <BasicInfo
            userData={userData}
            openModal={viewMode ? undefined : editModal.openModal}
          />
          <About
            openModal={viewMode ? undefined : editModal.openModal}
            personal_bio={userData?.personal_bio}
          />
          <Activity
            posts={userData?.userPosts}
            comments={userData?.recentComments}
            profileImage={userData?.profile_img}
          />
          <Education
            educations={userData.educations}
            onEditClick={
              viewMode
                ? undefined
                : () => {
                    setCurrentSection?.("education");
                    editModal.openModal();
                  }
            }
          />
          <Documents
            userData={userData}
            isLoading={isLoading}
            lastDocRef={lastDocRef}
            onLoadMore={loadMoreDocuments}
            onEditClick={
              viewMode
                ? undefined
                : () => {
                    setCurrentSection?.("certifications");
                    editModal.openModal();
                  }
            }
          />
        </div>
      </div>
    </>
  );
};
