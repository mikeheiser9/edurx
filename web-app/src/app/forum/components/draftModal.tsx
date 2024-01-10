import { Button } from "@/components/button";
import InfiniteScroll from "@/components/infiniteScroll";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks";
import { resetModalState, selectModalState } from "@/redux/ducks/modal.duck";
import { selectDraftCount, setDraftCount } from "@/redux/ducks/user.duck";
import { deleteDraftById, getUserDrafts } from "@/service/user.service";
import { faChevronLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UnFollowConfirmation from "./unFollowConfirmation";
import { AddPost } from "./addPost";

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
  const editPostModal = useModal();

  useEffect(() => {
    if (modal?.isOpen && modal?.type === "viewDraftModal") {
      viewDraftModal.openModal();
    }
    return () => {
      dispatch(resetModalState());
    };
  }, [modal]);

  const getDrafts = async (page: number = 1) => {
    setDraftLoading(true);
    setDraftError(false);
    const drafts = await getUserDrafts(page, draftsApiParams.limit);
    if (page == 1) {
      setAllDrafts([]);
    }
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
        onClick={deleteDraftModal.closeModal}
        className="ml-auto font-bold self-center cursor-pointer text-eduBlack"
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
          <div className="flex p-3 px-7 items-center  md:justify-start justify-center relative bg-eduDarkGray gap-3 ">
            <FontAwesomeIcon
              icon={faChevronLeft}
              size="sm"
              onClick={viewDraftModal.closeModal}
              className="text-xl self-center cursor-pointer text-gray-500 block md:hidden absolute left-5"
            />
            <span className="md:text-xl text-base md:text-eduBlack text- font-light  cursor-pointer">
              Your Drafts&nbsp;
              {`(${count})`}
            </span>
            <FontAwesomeIcon
              icon={faX}
              onClick={viewDraftModal.closeModal}
              className="ml-auto text-xl self-center cursor-pointer text-gray-500 md:block hidden"
            />
            
          </div>
        }
        showFooter={false}
        modalClassName="!h-[100%] !bg-eduLightGray"
      >
        <InfiniteScroll
          hasMoreData={count > allDrafts.length}
          callBack={onLoadMore}
          className={`flex flex-col gap-3 h-full !overflow-y-auto -mx-4 `}
          showLoading={draftLoading}
        >
          {allDrafts.map((draft: PostInterface, index: number) => {
            const content = draft?.content?.replace(/<\/?[^>]+(>|$)/g, "");
            const contentLength = content?.length;
            return (
              <>
                <div className="w-full md:px-6 px-4 " key={index}>
                  <div className="flex justify-between items-center mb-0.5">
                    <div>
                    <span className="w-[50px] py-0.5 inline-block text-xs border-solid border-eduBlack border-[1px] text-center  text-eduBlack rounded-sm bg-eduDarkGray md:bg-white">
                      {draft.postType}
                    </span>
                    </div>
                    <span className="text-eduDarkBlue md:text-sm text-10px">
                      {" "}
                      {moment(draft.publishedOn).format("DD/MM/YYYY")}
                    </span>
                  </div>
                 
                  <div className="flex justify-between md:items-end gap-2 ">
                    <div className="text-xs">
                    <p className="text-base text-eduBlack font-headers font-medium flex gap-2 items-center md:mb-1.5 mb-3">
                      {draft.title}
                    </p>
                    {contentLength != 0
                      ? `${content?.substring(0, 60)}${
                          (contentLength as number) > 60 ? "..." : ""
                        }`
                      : "no forum content"}
                      </div>
                      <div className="draftBtnWrap">
                    <div className="flex gap-2  justify-end md:flex-row flex-col">
                      <Button
                        className={`!w-[80px] md:!w-[100px] !rounded-md font-medium !m-0  md:!text-xs !text-xs `}
                        label={"Edit"}
                        onClick={() => {
                          setDraftPostToDelete(draft._id);
                          editPostModal.openModal();
                        }}
                      />
                      <Button
                        className={`!w-[80px] md:!w-[100px] !rounded-md font-medium !m-0  md:!text-xs !text-xs `}
                        label={"Delete"}
                        onClick={() => {
                          deleteDraftModal.openModal();
                          setDraftPostToDelete(draft._id);
                        }}
                      />
                    </div>
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

      {editPostModal.isOpen && (
        <AddPost
          addPostModal={editPostModal}
          // fetchPosts={() => {"" as }}
          postDetails={
            allDrafts?.filter(
              (draft) => draft.id == draftPostToDelete
            )?.[0] as any
          }
          getDrafts={() => getDrafts(1)}
        />
      )}
    </>
  );
}
