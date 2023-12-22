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
        size="sm"
        onClick={unfollowPostConfirmationModel.closeModal}
        className="ml-auto self-center cursor-pointer text-gray-500"
      />
    </div>
  );

  return (
    <>
      {post?._id && (
        <RequestListModal requestModal={requestModal} postId={post?._id} />
      )}
      <div
        className="flex w-full p-4 rounded-[10px] bg-eduLightGray gap-2 !cursor-pointer"
        onClick={onPostClick}
      >
        <div className="flex-1 gap-4 flex-col flex">
          <span className="text-eduDarkBlue text-[12px] font-body">
            Published on {moment(post?.createdAt).format("DD/MM/YYYY")} |{" "}
            {post?.postType}
          </span>
          <span className="text-[22px] text-eduBlack font-headers flex gap-2 items-center">
            <span>{post.title}</span>
            {post?.isPrivate && (
              <span className="w-[20px] h-[20px] rounded-lg bg-eduYellow flex justify-center items-center">
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
              <div className="py-[8px] px-[15px] bg-transparent border text-eduDarkBlue border-eduDarkBlue rounded-[5px] flex justify-center items-center">
                <span
                  key={category._id}
                  className="text-[8px] leading-[8px]"
                >
                  {category.name}
                </span>
              </div>
            ))}
            {post?.filters?.map((filter) => (
              <div className="py-[8px] px-[15px] bg-eduDarkGray text-eduDarkBlue rounded-[5px] flex justify-center items-center">
                <span
                key={filter._id}
                className="text-[8px] leading-[8px]"
                >
                {filter?.name}
                </span>
              </div>
              
            ))}
          </div>
        </div>
        <div className="flex-1 flex gap-8 justify-end items-center">
          <Button
            className={`w-[150px] rounded-md font-medium !m-0 text-sm ${
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
          <div className="flex flex-col items-center justify-center text-[12px] text-eduBlack gap-4">
            <div className="flex flex-col text-[12px]">
              <FontAwesomeIcon icon={faComments} className="text-[18px]" />
              <span className="font-sans font-semibold text-center mt-[5px]">
                {post?.commentCount}
              </span>
            </div>
            <div className="flex flex-col">
              <FontAwesomeIcon icon={faChartColumn} className="text-[18px]" />
              <span className="font-sans font-semibold text-center mt-[5px]">
                {post?.views}
              </span>
            </div>
          </div>
        </div>
        {isAdmin && (
          <div
            className="flex justify-center items-center px-6"
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
