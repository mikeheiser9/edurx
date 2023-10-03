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
    <div className="bg-primary p-2 px-4 font-sans flex gap-2">
      <div className="flex gap-2">
        <span className="flex gap-2 items-center">
          <FontAwesomeIcon icon={faArrowUp} className="font-bold" />
          {(post?.likeCount || 0) - (post?.dislikeCount || 0)}
          <FontAwesomeIcon icon={faArrowDown} className="font-bold" />
          |
          <FontAwesomeIcon icon={faNewspaper} />
        </span>{" "}
        {post?.title} |{" "}
        <b>
          {post?.forumType
            ? npiToDefinition[post.forumType as keyof typeof npiToDefinition] ||
              post?.forumType
            : "-"}
        </b>
      </div>
      <FontAwesomeIcon
        icon={faXmarkCircle}
        onClick={viewPostModal.closeModal}
        className="ml-auto self-center cursor-pointer"
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
      modalClassName="!w-2/4 !bg-primary-dark h-full"
      // modalBodyClassName="flex flex-auto p-4 !h-full overflow-y-auto"
      // closeOnEscape
      closeOnOutsideClick
    >
      <React.Fragment>
        {postId && (
          <RequestListModal requestModal={requestModal} postId={postId} />
        )}
        <div className="flex flex-col flex-auto text-white">
          <div className="flex flex-auto gap-4">
            <div className="flex flex-col gap-2 items-center">
              <span
                onClick={() => reactOnPost("like")}
                onAnimationEnd={() => updateAnimation("like", false)}
                className={`w-7 h-7 rounded-md flex cursor-pointer justify-center items-center border-2 ${
                  animate?.like && "animate-wiggle"
                } ${
                  userReactionOnPost === "like"
                    ? "border-primary text-primary"
                    : "border-white/50 text-white/50"
                } `}
              >
                <FontAwesomeIcon icon={faThumbsUp} size="sm" />
              </span>
              <span>{(post?.likeCount || 0) - (post?.dislikeCount || 0)}</span>
              <span
                onClick={() => reactOnPost("dislike")}
                onAnimationEnd={() => updateAnimation("dislike", false)}
                className={`w-7 h-7 rounded-md flex cursor-pointer justify-center items-center border-2 ${
                  animate?.dislike && "animate-wiggle"
                } ${
                  userReactionOnPost === "dislike"
                    ? "border-primary text-primary"
                    : "border-white/50 text-white/50"
                } `}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </span>
            </div>
            <div className="flex flex-auto flex-col gap-1">
              <div className="flex">
                <div className="flex flex-col flex-1">
                  <div className="flex gap-2 items-center w-full">
                    <span className="w-6 overflow-hidden h-6 justify-center items-center flex bg-white/80 rounded-full">
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
                    <span className="text-white text-xs">
                      {post?.forumType
                        ? npiToDefinition[
                            post.forumType as keyof typeof npiToDefinition
                          ] || post?.forumType
                        : "-"}
                    </span>
                    <span className="text-white/70 text-xs">
                      • Posted by{" "}
                      <b>
                        {post?.userId?.username ||
                          getFullName(
                            post?.userId?.first_name,
                            post?.userId?.last_name,
                            "_"
                          )}
                      </b>{" "}
                      • Published on{" "}
                      {moment(post?.createdAt).format("DD/MM/YYYY")}
                    </span>
                    <FontAwesomeIcon
                      icon={post?.isPrivate ? faLock : faEye}
                      className="animate-fade-in-down justify-center"
                      size="sm"
                    />
                    {post?.flag && <Badge label={post?.flag} type="warning" />}
                  </div>
                  <span className="text-white text-xl">{post?.title}</span>
                  <div className="flex gap-2 flex-wrap flex-auto">
                    {post?.categories?.map((category) => (
                      <span
                        key={category?._id}
                        className="text-xs p-1 px-2 bg-primary/25 text-white/50 rounded-md capitalize"
                      >
                        {category?.name}
                      </span>
                    ))}
                    {post?.tags?.map((tag) => (
                      <span
                        key={tag._id}
                        className="text-xs p-1 px-2 bg-[#0F366D] text-white/50 rounded-md capitalize"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                {isSelfPost ? (
                  <ReviewRequestButton onClick={requestModal.openModal} count={post?.userAccessRequestCount || 0}/>
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
                        className="text-white -mx-3"
                        readOnly
                        value={post?.content}
                        theme="bubble"
                      />
                    )}
                    <div className="flex gap-2 py-4 text-sm text-white/50">
                      <span>
                        <FontAwesomeIcon icon={faCommentDots} />{" "}
                        {post?.commentCount} Comments
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faChartColumn} /> {post?.views}{" "}
                        Views
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
            <div className="flex">
              <span className="flex text-white w-7 h-7 rounded-md cursor-pointer justify-center items-center">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>
    </Modal>
  );
};
