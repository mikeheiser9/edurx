import { Button } from "@/components/button";
import InfiniteScroll from "@/components/infiniteScroll";
import { Modal } from "@/components/modal";
import { showToast } from "@/components/toast";
import {
  getPostRequests,
  updatePostRequestsByAPI,
} from "@/service/post.service";
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
  const [pagination, setPagination] = useState<PageDataState>({
    page: 0,
    totalRecords: 0,
  });
  // const [updatedRequests, setUpdatedRequests] = useState<any[]>([]);

  const getRequestListByAPI = async (page: number = 1) => {
    try {
      let pagination = { page, limit: 5 };
      const response = await getPostRequests(postId, pagination);
      if (response?.status === responseCodes.SUCCESS) {
        setRequests(requests?.concat(response?.data?.data?.records || []));
        setPagination({
          page: response?.data?.data?.currentPage,
          totalRecords: response?.data?.data?.totalRecords,
        });
      } else throw new Error("Could not get requests");
    } catch (error) {
      showToast?.error((error as Error)?.message || "Unable to get requests");
    }
  };

  const onUserActtion = (type: "accept" | "reject" | "undo", request: any) => {
    // TO DO: update request status
    const updatedRequestIndex = requests?.findIndex(
      (r) => r?._id === request?._id
    );

    if (updatedRequestIndex === -1) return;
    requests[updatedRequestIndex].status =
      type === "accept" ? "accepted" : type === "reject" ? "denied" : "pending";
    if (type !== "undo") {
      Object.assign(requests?.[updatedRequestIndex], {
        // ...requests[updatedRequestIndex],
        isLocallyUpdated: true,
      });
    } else delete requests[updatedRequestIndex].isLocallyUpdated;
    setRequests((pre) => [...pre]);
  };

  const onSave = async () => {
    // TO DO: bulk save requests
    try {
      const requestToUpdate = requests
        ?.filter((r) => r?.isLocallyUpdated)
        ?.map((r) => {
          return {
            _id: r?._id,
            status: r?.status,
          };
        });
      const response = await updatePostRequestsByAPI(postId, requestToUpdate);
      if (response?.status === responseCodes.SUCCESS) {
        await getRequestListByAPI();
        showToast?.success(response?.data?.message);
        requestModal?.closeModal();
      } else throw new Error(response?.data?.message || "Unable to update");
    } catch (error) {
      showToast?.error((error as Error).message || "Something went wrong");
    }
  };

  const Header = () => (
    <div className="flex p-2 gap-2 bg-eduDarkGray">
      <span className="text-base text-center flex-1">
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
          <span className="w-7 overflow-hidden h-7 justify-center items-center flex bg-eduDarkGray rounded-full">
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
          <span className="flex items-center w-1/3 justify-around gap-4">
            {status === "pending" ? (
              <>
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-primary cursor-pointer"
                  onClick={() => onUserActtion("accept", request)}
                  size="lg"
                />
                <FontAwesomeIcon
                  icon={faX}
                  className="text-red-400 cursor-pointer"
                  onClick={() => onUserActtion("reject", request)}
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
                    onClick={() => onUserActtion("undo", request)}
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
    return () => {
      setRequests([]);
    };
  }, [requestModal.isOpen]);

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
        <div className="flex text-base my-4 mt-2 gap-2 items-center">
          <span className="font-headers">Name</span>
          <span className="flex-1" />
          <span className="flex flex-1 w-1/3 items-center gap-2 justify-around">
            <span className="font-headers">Approve</span>
            <span className="font-headers">Deny</span>
          </span>
        </div>
        {/* <InfiniteScroll
          callBack={() => getRequestListByAPI(pagination.page + 1)}
          hasMoreData={pagination?.totalRecords > requests?.length}
          className="flex gap-2 flex-col flex-auto max-h-[30vh] overflow-y-auto no-scrollbar"
          showLoading
        >
          {requests?.map((request) => (
            <Card request={request} key={request?._id} />
          ))}
        </InfiniteScroll> */}
        <div className="flex gap-2 flex-col flex-auto">
          {requests?.map((request) => (
            <Card request={request} key={request?._id} />
          ))}
          {
            requests.length==0 && <div className="flex justify-center text-center text-eduBlack text-[0.8em]">No Access Request Found...</div>
          }
        </div>
        <Button
          className="text-xs rounded-md !border-2 font-medium border-eduLightBlue !text-eduLightBlue w-auto mb-2 justify-end !px-8 hover:!text-white hover:bg-eduLightBlue duration-200 transition-colors"
          label="Save"
          disabled={!isUpdated}
          onClick={onSave}
        />
      </div>
    </Modal>
  );
};
