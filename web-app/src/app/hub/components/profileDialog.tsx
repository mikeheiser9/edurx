import { UserProfile } from "@/app/profile/components/profile";
import { Modal } from "@/components/modal";
import React from "react";

interface Props {
  profileModal: UseModalType;
  loggedInUser: UserData;
}
export const ProfileDialog = ({ profileModal, loggedInUser }: Props) => {
  return (
    <Modal visible={profileModal.isOpen} onClose={profileModal.closeModal}>
      <UserProfile userId={loggedInUser?._id} />
    </Modal>
  );
};