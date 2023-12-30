import { PostModal } from "@/app/forum/components/postModal";
import { UserProfile } from "@/app/profile/components/profile";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks";
import React, { useEffect, useState } from "react";

interface Props {
  profileModal: UseModalType;
  loggedInUser: UserData;
}
export const ProfileDialog = ({ profileModal, loggedInUser }: Props) => {
  const viewPostModal = useModal();
  const [selectedPostId, setSelectedPostId] = useState("");

  useEffect(() => {
    if (selectedPostId != "") {
      viewPostModal.openModal();
    }
  }, [selectedPostId]);
  useEffect(()=>{
    if(!viewPostModal.isOpen)
    {
      setSelectedPostId("")
    }
  },[viewPostModal.isOpen])
  return (
    <>
      <PostModal viewPostModal={viewPostModal} postId={selectedPostId} />
      <Modal
        visible={profileModal.isOpen}
        onClose={profileModal.closeModal}
        modalBodyClassName="relative  !h-full overflow-y-auto !w-full test"
        headerTitle="View Profile"
         modalClassName=" ipad-under:!max-h-[100vh] ipad-under:w-full  ipad-under:!rounded-none ipad-under:!min-h-[100vh] ipad-under:bg-eduLightGray"
         modalHedaerClassName="ipad-under:!bg-eduLightGray ipad-under:!border-b"
      >
        <UserProfile
          userId={loggedInUser?._id}
          profileModal={profileModal}
          setSelectedPostId={setSelectedPostId}
        />
      </Modal>
    </>
  );
};
