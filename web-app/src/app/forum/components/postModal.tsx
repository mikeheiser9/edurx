import { axiosGet } from "@/axios/config";
import { Modal } from "@/components/modal";
import { npiToDefinition, responseCodes } from "@/util/constant";
import { getFullName, getStaticImageUrl } from "@/util/helpers";
import {
  faCommentDots,
  faThumbsDown,
  faEye,
  faXmarkCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowDown,
  faArrowUp,
  faChartColumn,
  faEllipsisVertical,
  faImage,
  faLock,
  faNewspaper,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import {
  addUserReactionByAPI,
  addPostView,
  addPrivatePostRequest,
} from "@/service/post.service";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import dynamic from "next/dynamic";
import { CommentManager } from "./commentManager";
import { showToast } from "@/components/toast";
import { Badge } from "@/components/badge";
import { DummyPost } from "./dummyComps/dummyPost";
import { ReviewRequestButton } from "./sections";
import { useModal } from "@/hooks";
import { RequestListModal } from "./requestListModal";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  viewPostModal: UseModalType;
  postId: string;
}

export const PostModal = ({ postId, viewPostModal }: Props) => {
  const loggedInUser = useSelector(selectUserDetail);
  const [post, setPost] = useState<PostInterface>();
  const [isPostViewed, setIsPostViewed] = useState<string>("");
  const requestModal = useModal();
  const [animate, setAnimate] = useState<{ like: boolean; dislike: boolean }>({
    like: false,
    dislike: false,
  });
  const userReactionOnPost: ReactionTypes | null =
    post?.reactions?.[0]?.reactionType || null;
  const isSelfPost: boolean | undefined =
    loggedInUser?._id === post?.userId?.id;
  const requestStatus: PostRequestStatus | null =
    post?.userAccessRequests?.find(
      (req: any) => req?.userId === loggedInUser?._id
    )?.status || null;

  const getRequestButtonLabel = (): string => {
    switch (requestStatus) {
      case "pending":
        return "Awaiting Approval";
      case "accepted":
        return "Access granted";
      case "denied":
        return "Access Denied";
      default:
        return "Request to join";
    }
  };

  const getPostById = async () => {
    await axiosGet(`/post/${postId}`)
      .then((response) => {
        if (response.status === responseCodes.SUCCESS) {
          setPost(response?.data?.data);
        }
      })
      .catch((error) => console.log("Failed to get post", error));
  };

  const addPostViewByAPI = async () => {
    try {
      const payload = {
        userId: loggedInUser?._id,
        itemType: "post",
        itemId: postId,
      };
      const response = await addPostView(payload);
      if (response?.status === responseCodes.SUCCESS) {
        setIsPostViewed(postId);
      }
    } catch (error) {
      setIsPostViewed("");
      console.log("error adding post view", error);
    }
  };

  const addReaction = async (
    reactionType: ReactionTypes,
    targetType: TargetTypes,
    targetId: string,
    parentId?: string
  ) => {
    try {
      const payload = {
        reactionType,
        targetType,
        userId: loggedInUser?._id,
        [targetType === "post" ? "postId" : "commentId"]: targetId,
      };
      const reaction = await addUserReactionByAPI(payload);

      if (reaction.status === responseCodes.SUCCESS) {
        setPost((prevState: any) => {
          const updatedState = { ...prevState };
          if (targetType === "post") {
            const { likeCount, dislikeCount } = updatedState;
            updatedState.reactions = [reaction.data.data];
            updatedState.likeCount = userReactionOnPost
              ? reactionType === "like"
                ? likeCount + 1
                : likeCount - 1
              : reactionType === "like"
              ? likeCount + 1
              : likeCount;
            updatedState.dislikeCount = userReactionOnPost
              ? reactionType === "dislike"
                ? dislikeCount + 1
                : dislikeCount - 1
              : reactionType === "dislike"
              ? dislikeCount + 1
              : dislikeCount;
          } else if (targetType === "comment") {
            const indexOfUpdatedComment = updatedState.comments.findIndex(
              (item: any) =>
                item?._id ===
                (parentId ? parentId : reaction.data.data.commentId)
            );
            let indexOfReply =
              parentId &&
              updatedState?.comments?.[
                indexOfUpdatedComment
              ]?.replies?.findIndex(
                (item: any) => item?._id === reaction?.data?.data.commentId
              );
            if (indexOfUpdatedComment === -1) return;
            const updatedComment =
              parentId && indexOfReply !== -1
                ? {
                    ...updatedState.comments[indexOfUpdatedComment]?.replies?.[
                      indexOfReply
                    ],
                  }
                : {
                    ...updatedState.comments[indexOfUpdatedComment],
                  };
            const { likeCount, dislikeCount } = updatedComment;
            const userReactionOnComment: "like" | "dislike" | null =
              updatedComment?.reactions?.[0]?.reactionType || null;
            updatedComment.reactions = [reaction.data.data];
            updatedComment.likeCount = userReactionOnComment
              ? reactionType === "like"
                ? likeCount + 1
                : likeCount - 1
              : reactionType === "like"
              ? likeCount + 1
              : likeCount;
            updatedComment.dislikeCount = userReactionOnComment
              ? reactionType === "dislike"
                ? dislikeCount + 1
                : dislikeCount - 1
              : reactionType === "dislike"
              ? dislikeCount + 1
              : dislikeCount;

            if (parentId && indexOfReply !== -1) {
              updatedState.comments[indexOfUpdatedComment].replies[
                indexOfReply
              ] = updatedComment;
            } else {
              updatedState.comments[indexOfUpdatedComment] = updatedComment;
            }
          }

          return updatedState;
        });
      } else throw new Error("Unable to add reaction");
    } catch (error) {
      (error as Error)?.message && showToast.error((error as Error)?.message);
      console.log("Failed to add reaction", error);
    }
  };

  const updateAnimation = (type: ReactionTypes, value: boolean) => {
    setAnimate((preState) => {
      return {
        ...preState,
        [type]: value,
      };
    });
  };

  const reactOnPost = (type: ReactionTypes) => {
    updateAnimation(type, true);
    if (userReactionOnPost !== type) {
      addReaction(type, "post", postId);
    }
  };

  const requestAccess = async () => {
    if (requestStatus !== null) return;
    try {
      const payload = {
        status: "pending",
        userId: loggedInUser?._id,
        postId: post?._id,
      };
      const response = await addPrivatePostRequest(payload);
      if (response?.status === responseCodes.SUCCESS) {
        setPost((preState: any) => {
          return {
            ...preState,
            userAccessRequests: [response?.data?.data],
          };
        });
      }
      console.log(response);
    } catch (error) {
      showToast?.error((error as Error)?.message || "Something went wrong");
    }
  };

  const HeaderJsx = (): React.ReactElement => (
    <div className="bg-eduDarkGray p-2 px-4 font-sans flex gap-2 h-[50px] items-center">
      <div className="flex gap-4">
        <span className="flex gap-4 items-center font-body text-[16px]">
          <FontAwesomeIcon icon={faArrowUp} className="font-bold " />
          {(post?.likeCount || 0) - (post?.dislikeCount || 0)}
          <FontAwesomeIcon icon={faArrowDown} className="font-bold" />
          <span>|</span>
          <FontAwesomeIcon icon={faNewspaper} />
        </span>{" "}
        <span className="font-body text-[16px]">{post?.title}</span>
        <span>| </span>
        <span className="font-body font-semibold">
          {post?.forumType
            ? npiToDefinition[post.forumType as keyof typeof npiToDefinition] ||
              post?.forumType
            : "-"}
        </span>
      </div>
      <FontAwesomeIcon
        icon={faXmarkCircle}
        onClick={viewPostModal.closeModal}
        className="ml-auto self-center cursor-pointer text-[24px] text-eduBlack"
      />
    </div>
  );

  useEffect(() => {
    if (!viewPostModal?.isOpen) return;
    getPostById();
    isPostViewed !== postId && addPostViewByAPI();
  }, [postId, viewPostModal.isOpen]);

  if (!postId || !post) return <></>;

  console.log(post);

  return (
    <Modal
      // headerTitle="Post"
      onClose={viewPostModal.closeModal}
      visible={viewPostModal.isOpen}
      showCloseIcon
      customHeader={<HeaderJsx />}
      showFooter={false}
      modalClassName="h-full"
      // modalBodyClassName="flex flex-auto p-4 !h-full overflow-y-auto"
      // closeOnEscape
      closeOnOutsideClick
    >
      <React.Fragment>
        {postId && (
          <RequestListModal requestModal={requestModal} postId={postId} />
        )}
        <div className="flex flex-col flex-auto text-eduBlack">
          <div className="flex flex-auto gap-4">
            <div className="flex flex-col gap-2 items-center">
              <span
                onClick={() => reactOnPost("like")}
                onAnimationEnd={() => updateAnimation("like", false)}
                className={`w-7 h-7 ease-in-out duration-300  cursor-pointer rounded-md flex justify-center items-center border-2 ${
                  animate?.like && "animate-wiggle"
                } ${
                  userReactionOnPost === "like"
                    ? "border-eduYellow text-eduYellow"
                    : "border-eduDarkBlue text-eduDarkBlue"
                } `}
              >
                <FontAwesomeIcon icon={faThumbsUp} size="sm" />
              </span>
              <span className="font-body">
                {(post?.likeCount || 0) - (post?.dislikeCount || 0)}
              </span>
              <span
                onClick={() => reactOnPost("dislike")}
                onAnimationEnd={() => updateAnimation("dislike", false)}
                className={`w-7 h-7 rounded-md flex cursor-pointer justify-center items-center border-2 ${
                  animate?.dislike && "animate-wiggle"
                } ${
                  userReactionOnPost === "dislike"
                    ? "border-primary text-primary"
                    : "border-eduDarkBlue text-EduDarkBlue"
                } `}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </span>
            </div>
            <div className="flex flex-auto flex-col gap-1">
              <div className="flex">
                <div className="flex flex-col flex-1">
                  <div className="flex gap-2 items-center w-full">
                    <div>
                      <span className="w-[28px] overflow-hidden h-[28px] justify-center items-center flex bg-eduDarkGray rounded-full">
                        {post?.userId?.profile_img ? (
                          <Image
                            src={getStaticImageUrl(post?.userId?.profile_img)}
                            width={200}
                            height={200}
                            alt="user_img"
                          />
                        ) : (
                          <FontAwesomeIcon icon={faImage} />
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-eduDarkBlue text-[14px] font-body">
                        {post?.forumType
                          ? npiToDefinition[
                              post.forumType as keyof typeof npiToDefinition
                            ] || post?.forumType
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span>•</span>
                    </div>
                    <div>
                      <span className="text-eduDarkBlue text-[14px] font-body">
                        Posted by{" "}
                        <span className="font-body font-semibold">
                          {post?.userId?.username ||
                            getFullName(
                              post?.userId?.first_name,
                              post?.userId?.last_name,
                              "_"
                            )}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>•</span>
                    </div>
                    <div>
                      <span className="font-body text-[14px] text-eduDarkBlue">
                        Published on{" "}
                        {moment(post?.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center">
                      <FontAwesomeIcon
                        icon={post?.isPrivate ? faLock : faEye}
                        className="animate-fade-in-down justify-center"
                        size="sm"
                      />
                      <span className="flex flex-1 justify-end text-eduBlack">
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </span>
                    </div>
                    {/* {post?.flag && <Badge label={post?.flag} type="default" />} */}
                  </div>
                  <div>
                    <h2 className="text-eduBlack text-[28px] font-headers">
                      {post?.title}
                    </h2>
                  </div>
                  <div className="flex gap-2 flex-wrap flex-auto">
                    {post?.categories?.map((category: any) => (
                      <span
                        key={category?._id}
                        className="text-[12px] py-2 px-4 bg-transparent text-eduDarkBlue rounded-[10px] border border-eduDarkBlue"
                      >
                        {category?.name}
                      </span>
                    ))}
                    {post?.tags?.map((tag: any) => (
                      <span
                        key={tag._id}
                        className="text-[12px] p-2 px-4 bg-eduDarkGray rounded-[10px]"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                {isSelfPost ? (
                  <ReviewRequestButton
                    onClick={requestModal.openModal}
                    count={post?.userAccessRequestCount || 0}
                  />
                ) : (
                  <button
                    onClick={requestAccess}
                    className="p-2 px-4 text-sm text-black rounded-md bg-white m-auto"
                  >
                    {getRequestButtonLabel()}
                  </button>
                )}
              </div>
              <>
                {post?.isPrivate && !isSelfPost ? (
                  <DummyPost />
                ) : (
                  <>
                    {post?.content && (
                      <ReactQuill
                        className="text-eduBlack -mx-3 post-body"
                        readOnly
                        value={post?.content}
                        theme="bubble"
                      />
                    )}
                    <div className="flex flex-1 gap-4 py-4 text-eduDarkBlue items-center">
                      <span className="font-body text-[14px]">
                        <FontAwesomeIcon
                          className="text-[18px]"
                          icon={faCommentDots}
                        />{" "}
                        {post?.commentCount} Comments
                      </span>
                      <span className="font-body text-[14px]">
                        <FontAwesomeIcon
                          className="text-[18px]"
                          icon={faChartColumn}
                        />{" "}
                        {post?.views} Views
                      </span>
                    </div>
                    <CommentManager
                      addReaction={addReaction}
                      post={post}
                      setPost={setPost}
                      getPostById={getPostById}
                    />
                  </>
                )}
              </>
            </div>
          </div>
        </div>
      </React.Fragment>
    </Modal>
  );
};
