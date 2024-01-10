import {
  postFlags,
  postLabelType,
  responseCodes,
  roleAccess,
} from "@/util/constant";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faEllipsisVertical,
  faLock,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useState } from "react";
import { AdminActionsMenu } from "./adminActionsMenu";
import { DummyPostCard } from "./dummyComps/dummyPostCard";
import { Button } from "@/components/button";
import { useModal } from "@/hooks";
import { RequestListModal } from "./requestListModal";
import { addPrivatePostRequest, followPost } from "@/service/post.service";
import { Modal } from "@/components/modal";
import UnFollowConfirmation from "./unFollowConfirmation";

interface Props {
  post: PostInterface;
  onPostClick: () => void;
  userRole?: USER_ROLES;
  onDeletePost?: () => void;
  onFlagPost?: (postId: string, flag: PostFlags) => void;
  isPostOwner: boolean;
  loggedUserId: string;
}

export const PostCard = (props: Props) => {
  const {
    isPostOwner,
    loggedUserId,
    onPostClick,
    post,
    onDeletePost,
    onFlagPost,
    userRole,
  } = props;
  const isAdmin = userRole === roleAccess.ADMIN;
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const requestModal = useModal();
  const unfollowPostConfirmationModel = useModal();
  const returnButtonWithAppropriateLabel = () => {
    if (isPostOwner) {
      if (post.isPrivate) {
        return postLabelType["Review Requests"];
      }
      return postLabelType.View;
    } else if (
      post?.userPostFollowList?.[0] &&
      post?.userPostFollowList?.[0].userId == loggedUserId
    ) {
      return postLabelType.Following;
    } else if (post?.postRequests?.[0]?.status == "pending") {
      return postLabelType.Requested;
    } else {
      return postLabelType.Follow;
    }
  };
  const [forumButtonLabel, setForumButtonLabel] = useState(
    returnButtonWithAppropriateLabel()
  );
  const isFlagged: boolean =
    post?.flag && postFlags?.includes(post?.flag) ? true : false;
  const handleAdminActions = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsToggle(!isToggle);
    // toggleMenuRef?.current?.scrollIntoView({
    //   behavior: "smooth",
    // });
  };

  const flagPost = (flag: string) => {
    onFlagPost?.(post?._id, flag as PostFlags);
    setCurrentStep(0);
    setIsToggle(false);
  };

  if (isFlagged)
    return (
      <DummyPostCard
        post={post}
        onViewClcik={onPostClick}
        isAdmin={isAdmin}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isToggle={isToggle}
        onDeletePost={onDeletePost}
        onFlagPost={flagPost}
        onEditClick={handleAdminActions as any}
      />
    );

  const handleForumAction = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (
      ["Review Requests", "Follow", "Following", "Unfollow"].includes(
        forumButtonLabel
      )
    ) {
      e.stopPropagation();
    }
    if (forumButtonLabel == "Unfollow") {
      unfollowPostConfirmationModel.openModal();
    } else if (forumButtonLabel == "Review Requests") {
      requestModal.openModal();
    } else if (forumButtonLabel == "Follow") {
      if (post.isPrivate) {
        const payload = {
          status: "pending",
          userId: loggedUserId,
          postId: post?._id,
        };
        const response = await addPrivatePostRequest(payload);
        if (response?.status === responseCodes.SUCCESS) {
          setForumButtonLabel("Requested");
        }
      } else {
        const res = await followPost(post._id, "add");
        if (res.status == responseCodes.SUCCESS) {
          setForumButtonLabel("Following");
        }
      }
    }
  };

  const unFollowPost = async () => {
    const res = await followPost(post._id, "remove");
    if (res) {
      if (res.status == responseCodes.SUCCESS) {
        setForumButtonLabel("Follow");
        unfollowPostConfirmationModel.closeModal();
      }
    }
  };
  const Header = () => (
    <div className="flex p-2 gap-2 bg-eduDarkGray">
      <span className="text-base text-center flex-1">Confirmation</span>
      <FontAwesomeIcon
        icon={faX}
        onClick={unfollowPostConfirmationModel.closeModal}
        className="ml-auto font-bold self-center cursor-pointer text-eduBlack"
      />
    </div>
  );

  return (
    <>
      {post?._id && (
        <RequestListModal requestModal={requestModal} postId={post?._id} />
      )}
      <div
        className="flex w-full p-4 rounded-[10px] bg-eduLightGray items-center justify-between"        
      >
        <div onClick={onPostClick} className="w-full flex items-center justify-between gap-2 tablet-lg:gap-2.5 !cursor-pointer postcard tablet-lg:flex-wrap tablet-lg:flex-col z-10">
          <div className="flex-1 gap-4 tablet-lg:gap-2.5 flex-col flex">
            <div className="flex justify-between ipad-under:items-center gap-1">
            <span className="text-eduDarkBlue text-[12px] ipad-under:text-[11px] font-body">
              Published on {moment(post?.createdAt).format("DD/MM/YYYY")} |{" "}
              {post?.postType}
            </span>
            <span className="hidden tablet-lg:block">
            <Button
              className={`w-[150px] tablet-lg:w-[100px] rounded-md font-medium !m-0 text-sm tablet-lg:text-[11px] ${
                ["Following", "Requested"].includes(forumButtonLabel) &&
                "!bg-eduLightBlue text-white"
              }`}
              label={forumButtonLabel}
              onClick={handleForumAction}
              onMouseEnter={() => {
                if (forumButtonLabel == "Following") {
                  setForumButtonLabel("Unfollow");
                }
              }}
              onMouseLeave={() => {
                if (forumButtonLabel == "Unfollow") {
                  setForumButtonLabel("Following");
                }
              }}
              disabled={forumButtonLabel == "Requested"}
            />
            </span>
            </div>
            <span className="text-[22px] ipad-under:text-[15px] tablet-lg:text-[20px] ipad-under:leading-normal ipad-under:font-medium text-eduBlack font-headers flex gap-2 items-center">
              <span>{`${post.title?.substring(0,120)} ${post.title && post.title?.length>120 ? '...' :""}`}</span>
              {post?.isPrivate && (
                <span className="w-[20px] h-[20px] min-w-[20px] rounded-lg bg-eduYellow flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="animate-fade-in-down w-[0.7em] "
                    size="2xs"
                  />
                </span>
              )}
            </span>
            <div className="flex flex-wrap gap-2">
              {post?.categories?.map((category) => (
                <span
                  key={category._id}
                  className="text-[8px] py-1.5 px-4 leading-normal ipad-under:py-1 ipad-under:px-2 ipad-under:rounded-sm ipad-under:leading-normal bg-white text-eduDarkBlue rounded-[5px] border border-eduDarkBlue"
                >
                  {category.name}
                </span>
              ))}
              {post?.filters?.map((filter) => (
                  <span
                  key={filter._id}
                  className="text-[8px] py-1.5 flex items-center px-4 leading-normal ipad-under:py-1 ipad-under:px-2 ipad-under:rounded-sm ipad-under:leading-normal bg-eduDarkGray text-eduDarkBlue rounded-[5px]"
                >
                  {filter?.name}
                  </span>
              ))}
            </div>
          </div>
          <div className="flex-1 flex gap-8 justify-end items-center tablet-lg:justify-between">
            <Button
              className={`w-[150px] tablet-lg:hidden rounded-md font-medium !m-0 text-sm ${
                ["Following", "Requested"].includes(forumButtonLabel) &&
                "!bg-eduLightBlue text-white"
              }`}
              label={forumButtonLabel}
              onClick={handleForumAction}
              onMouseEnter={() => {
                if (forumButtonLabel == "Following") {
                  setForumButtonLabel("Unfollow");
                }
              }}
              onMouseLeave={() => {
                if (forumButtonLabel == "Unfollow") {
                  setForumButtonLabel("Following");
                }
              }}
              disabled={forumButtonLabel == "Requested"}
            />
            <div className="flex flex-col tablet-lg:flex-row ipad-under:justify-between items-center justify-center text-[12px] text-eduBlack gap-4">
              <div className="flex tablet-lg:gap-2 flex-col tablet-lg:flex-row tablet-lg:items-center text-[12px]">
                <FontAwesomeIcon icon={faChartColumn} className="text-[18px] ipad-under:text-[14px]" />
                <span className="font-sans font-semibold text-center mt-[5px] tablet-lg:mt-0">
                  {post?.views}
                </span>
              </div>
              <div className="flex tablet-lg:gap-2 flex-col tablet-lg:flex-row tablet-lg:items-center text-[12px]">
                <FontAwesomeIcon icon={faComments} className="text-[18px] ipad-under:text-[14px]" />
                <span className="font-sans font-semibold text-center mt-[5px] tablet-lg:mt-0">
                  {post?.commentCount}
                </span>
              </div>
            </div>
            {isAdmin && (
            <div
              className=" justify-center items-center md:px-6 tablet-lg:flex hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="cursor-pointer"
                size="xl"
                onClick={handleAdminActions}
              />

              {isToggle && (
                <AdminActionsMenu
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  onDeletePost={onDeletePost}
                  onFlagPost={flagPost}
                  currentFlag={post?.flag}
                />
              )}
            </div>
          )}
          </div>
        </div>
        <div className="">
          {isAdmin && (
            <div
              className="flex justify-center items-center px-4 tablet-lg:hidden"
            
            >
              <span  onClick={(e) => e.stopPropagation()}>
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="cursor-pointer"
                size="xl"
                onClick={handleAdminActions}
              /></span>

              {isToggle && (
                <AdminActionsMenu
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  onDeletePost={onDeletePost}
                  onFlagPost={flagPost}
                  currentFlag={post?.flag}
                />
              )}
            </div>
          )}
        </div>

        <Modal
          onClose={unfollowPostConfirmationModel.closeModal}
          visible={unfollowPostConfirmationModel.isOpen}
          customHeader={<Header />}
          showCloseIcon
          modalClassName="!w-auto min-w-[30rem] !rounded-lg"
          modalBodyClassName="bg-white"
          showFooter={false}
          closeOnEscape
          closeOnOutsideClick
        >
          <UnFollowConfirmation
            unFollowPost={unFollowPost}
            modelClosingFunction={unfollowPostConfirmationModel.closeModal}
            confirmationLabel="Are you sure you want to unfollow this post...?"
          />
        </Modal>
      </div>
    </>
  );
};
