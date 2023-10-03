import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { showToast } from "@/components/toast";
import { getPostRequests } from "@/service/post.service";
import { responseCodes } from "@/util/constant";
import { getFullName, getStaticImageUrl } from "@/util/helpers";
import {
  faCheck,
  faRotateLeft,
  faUserAlt,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Props {
  requestModal: UseModalType;
  postId: string;
}

export const RequestListModal = ({ requestModal, postId }: Props) => {
  const [requests, setRequests] = useState<any[]>([]);
  const isUpdated: boolean = requests?.some((r) => r?.isLocallyUpdated);
  // const [updatedRequests, setUpdatedRequests] = useState<any[]>([]);

  const getRequestListByAPI = async () => {
    try {
      const response = await getPostRequests(postId);
      if (response?.status === responseCodes.SUCCESS) {
        setRequests(response?.data?.data);
      } else throw new Error("Could not get requests");
    } catch (error) {
      showToast?.error((error as Error)?.message || "Unable to get requests");
    }
  };

  const Header = () => (
    <div className="flex p-2 gap-2 bg-[#E7E5E2]">
      <span className="text-sm text-center flex-1">
        Private Post Access Requests
      </span>
      <FontAwesomeIcon
        icon={faX}
        size="sm"
        onClick={requestModal.closeModal}
        className="ml-auto self-center cursor-pointer text-gray-500"
      />
    </div>
  );

  const Card = ({ request }: { request: any }) => {
    const status: PostRequestStatus = request?.status;
    return (
      <>
        <div className="flex gap-2 items-center">
          <span className="w-7 overflow-hidden h-7 justify-center items-center flex bg-[#E7E5E2] rounded-full">
            {request?.userId?.profile_img ? (
              <Image
                src={getStaticImageUrl(request?.userId?.profile_img)}
                width={200}
                height={200}
                alt="user_img"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserAlt}
                size="xs"
                className="text-gray-500"
              />
            )}
          </span>
          <span className="text-sm flex-1">
            {getFullName(
              request?.userId?.first_name,
              request?.userId?.last_name
            )}
          </span>
          <span className="flex items-center w-1/4 justify-around gap-2">
            {status === "pending" ? (
              <>
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-primary cursor-pointer"
                  size="lg"
                />
                <FontAwesomeIcon
                  icon={faX}
                  className="text-red-400 cursor-pointer"
                />
              </>
            ) : (
              <>
                <span
                  className={`text-xs font-semibold ${
                    status === "accepted" ? "text-primary" : "text-[#13222A]"
                  }`}
                >
                  {status === "accepted" ? "Approved" : "Denied"}
                </span>
                {request?.isLocallyUpdated && (
                  <FontAwesomeIcon
                    icon={faRotateLeft}
                    size="xs"
                    className="to-gray-500 cursor-pointer animate-scale-in"
                  />
                )}
              </>
            )}
          </span>
        </div>
        <hr className="last:hidden m-0.5" />
      </>
    );
  };

  useEffect(() => {
    if (!requestModal.isOpen) return;
    getRequestListByAPI();
  }, [requestModal.isOpen]);

  console.log(requests);

  return (
    <Modal
      onClose={requestModal.closeModal}
      visible={requestModal.isOpen}
      customHeader={<Header />}
      modalClassName="!w-auto min-w-[20rem] !rounded-lg"
      modalBodyClassName="bg-white"
      showFooter={false}
      closeOnEscape
    >
      <div className="p-4 flex gap-2 flex-col bg-white flex-auto">
        <div className="flex text-xs my-4 mt-2 gap-2 items-center">
          <span>Name</span>
          <span className="text-sm flex-1" />
          <span className="flex w-1/4 items-center gap-2 justify-around">
            <span>Approve</span>
            <span>Deny</span>
          </span>
        </div>
        <div className="flex gap-2 flex-col flex-auto">
          {requests?.map((request) => (
            <Card request={request} key={request?._id} />
          ))}
        </div>
        <Button
          className="text-xs bg-transparent outline outline-1 outline-[#0F366D] text-[#0F366D] w-auto mt-2 justify-end !px-6 hover:text-white hover:bg-[#0F366D] duration-200 transition-colors"
          label="Save"
          disabled={!isUpdated}
        />
      </div>
    </Modal>
  );
};
