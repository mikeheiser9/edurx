import EditProfile from "@/app/profile/components/edit";
import { ModalFooter, ModalHeader } from "@/app/profile/sections";
import { axiosGet } from "@/axios/config";
import { Modal } from "@/components/modal";
import { showToast } from "@/components/toast";
import { profileSections, responseCodes } from "@/util/constant";
import React, { useState } from "react";

interface Props {
  editProfileModal: UseModalType;
  loggedInUser: UserData;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
}

export const EditProfileDialog = ({
  editProfileModal,
  loggedInUser,
  userData,
  setUserData,
}: Props) => {
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
  const [saveAndExitButtonPressed,setSaveAndExitButtonPressed]=useState(false);

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
      } else throw new Error("Something went wrong");
    } catch (err) {
      showToast.error("Unable to more documents");
    } finally {
      setIsDocsLoading(false);
    }
  };

  if (!userData) return <></>;
  return (
    <Modal
      visible={editProfileModal.isOpen}
      onClose={editProfileModal.closeModal}
      closeOnOutsideClick
      modalClassName="md:!w-2/5"
      modalBodyClassName="flex flex-auto p-4 !h-full overflow-y-auto"
      customHeader={
        <ModalHeader
          closeModal={editProfileModal.closeModal}
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
          closeModal={editProfileModal.closeModal}
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
        saveAndExitButtonPressed={saveAndExitButtonPressed}
        setSaveAndExitButtonPressed={setSaveAndExitButtonPressed}
      />
    </Modal>
  );
};
