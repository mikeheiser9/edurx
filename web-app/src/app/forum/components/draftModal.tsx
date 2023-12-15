import { Button } from "@/components/button";
import InfiniteScroll from "@/components/infiniteScroll";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks";
import { selectModalState, setModalState } from "@/redux/ducks/modal.duck";
import { selectDraftCount, setDraftCount } from "@/redux/ducks/user.duck";
import { deleteDraftById, getUserDrafts } from "@/service/user.service";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UnFollowConfirmation from "./unFollowConfirmation";

interface draftsApiParamsType {
  page: number;
  limit: number;
}

export default function DraftModal() {
  const count = useSelector(selectDraftCount);
  const modal = useSelector(selectModalState);
  const viewDraftModal = useModal();
  const dispatch = useDispatch();
  const [draftsApiParams, setDraftsApiParams] = useState<draftsApiParamsType>({
    page: 1,
    limit: 10,
  });

  //states for all drafts
  const [allDrafts, setAllDrafts] = useState<PostInterface[]>([]);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftPostToDelete, setDraftPostToDelete] = useState("");
  const [draftError, setDraftError] = useState(false);

  // states for delete forums
  const [deleteLoader, setDeleteLoader] = useState(false);
  const deleteDraftModal = useModal();

  useEffect(() => {
    if (modal) {
      viewDraftModal.openModal();
    }
    return () => {
      dispatch(setModalState({ isOpen: false }));
    };
  }, [modal]);

  const getDrafts = async (page: number = 1) => {
    setDraftLoading(true);
    setDraftError(false);
    const drafts = await getUserDrafts(page, draftsApiParams.limit);
    if (drafts?.data?.response_type == "Success" && drafts?.data?.data) {
      setAllDrafts((prevState) => {
        return [...prevState, ...drafts?.data?.data];
      });
      setDraftLoading(false);
    } else {
      setDraftError(true);
      setDraftLoading(false);
    }
  };

  const onLoadMore = (): any => {
    return getDrafts(draftsApiParams.page + 1);
  };
  useEffect(() => {
    if (viewDraftModal.isOpen && count > 0) {
      setAllDrafts([]);
      setDraftsApiParams({
        limit: 10,
        page: 1,
      });
      getDrafts();
    }
  }, [viewDraftModal.isOpen]);

  const deleteDraft = async () => {
    setDeleteLoader(true);
    const deleteRes = await deleteDraftById(draftPostToDelete);
    if (deleteRes.data.response_type == "Success" && draftPostToDelete) {
      setDeleteLoader(false);
      if (deleteRes?.data?.data?.rowAffected == 1) {
        dispatch(setDraftCount(count - 1));
        setAllDrafts(
          allDrafts.filter((draft) => draft._id != draftPostToDelete)
        );
      }
      setDraftPostToDelete("");
      deleteDraftModal.closeModal();
    }
  };
  const Header = () => (
    <div className="flex p-2 gap-2 bg-eduDarkGray">
      <span className="text-base text-center flex-1">Confirmation</span>
      <FontAwesomeIcon
        icon={faX}
        size="sm"
        onClick={deleteDraftModal.closeModal}
        className="ml-auto self-center cursor-pointer text-gray-500"
      />
    </div>
  );

  return (
    <>
      <Modal
        onClose={viewDraftModal.closeModal}
        visible={viewDraftModal.isOpen}
        showCloseIcon
        customHeader={
          <div className="flex p-3 px-7 items-center  justify-start bg-eduDarkGray gap-3 ">
            <span className="text-xl pl-5 font-light  cursor-pointer">
              Your Drafts&nbsp;
              {`(${count})`}
            </span>
            <FontAwesomeIcon
              icon={faX}
              size="sm"
              onClick={viewDraftModal.closeModal}
              className="ml-auto text-xl self-center cursor-pointer text-gray-500"
            />
          </div>
        }
        showFooter={false}
        modalClassName="!h-[100%] !bg-eduLightGray"
      >
        <InfiniteScroll
          hasMoreData={count > allDrafts.length}
          callBack={onLoadMore}
          className={`flex flex-col gap-3 h-full !overflow-y-auto `}
          showLoading={draftLoading}
        >
          {allDrafts.map((draft: PostInterface, index: number) => {
            const content = draft?.content?.replace(/<\/?[^>]+(>|$)/g, "");
            const contentLength = content?.length;
            return (
              <>
                <div className="w-full px-9 " key={index}>
                  <div className="flex justify-between">
                    <span className="w-[4em] border-solid border-[#13222A] border-[1px] text-center opacity-[60%] text-[#13222A] rounded bg-white">
                      {draft.postType}
                    </span>
                    <span className="text-eduDarkBlue">
                      {" "}
                      {moment(draft.publishedOn).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <span className="text-[22px] text-eduBlack font-headers flex gap-2 items-center">
                    {draft.title}
                  </span>
                  <div className="flex justify-between ">
                    {contentLength != 0
                      ? `${content?.substring(0, 60)}${
                          (contentLength as number) > 60 ? "..." : ""
                        }`
                      : "no forum content"}
                    <div className="flex gap-2  justify-end">
                      <Button
                        className={`w-[100px] rounded-md font-medium !m-0 text-sm `}
                        label={"Edit"}
                        onClick={() => {}}
                      />
                      <Button
                        className={`w-[100px] rounded-md font-medium !m-0 text-sm `}
                        label={"Delete"}
                        onClick={() => {
                          deleteDraftModal.openModal();
                          setDraftPostToDelete(draft._id);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <hr></hr>
              </>
            );
          })}
          {!draftLoading && draftError && (
            <span className="text-center">Oops.., Error fetching draft</span>
          )}
          {!draftLoading && !draftError && allDrafts.length == 0 && (
            <span className="text-center">No drafts saved yet!</span>
          )}
        </InfiniteScroll>
      </Modal>
      <Modal
        onClose={() => {
          setDraftPostToDelete("");
          deleteDraftModal.closeModal();
        }}
        visible={deleteDraftModal.isOpen}
        customHeader={<Header />}
        showCloseIcon
        modalClassName="!w-auto min-w-[30rem] !rounded-lg"
        modalBodyClassName="bg-white"
        showFooter={false}
      >
        <UnFollowConfirmation
          unFollowPost={deleteDraft}
          modelClosingFunction={() => {
            setDraftPostToDelete("");
            deleteDraftModal.closeModal();
          }}
          confirmationLabel="Are you sure you want to delete this draft...?"
          deleteLoader={deleteLoader}
        />
      </Modal>
    </>
  );
}
