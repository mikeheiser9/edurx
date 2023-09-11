import { axiosGet } from "@/axios/config";
import { Modal } from "@/components/modal";
import { npiToDefinition } from "@/util/constant";
import { getFullName, getStaticImageUrl } from "@/util/helpers";
import {
  faCommentDots,
  faThumbsDown,
  faEye,
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
import { addUserReactionByAPI, addPostView } from "@/service/post.service";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import dynamic from "next/dynamic";
import { CommentManager } from "./commentManager";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  viewPostModal: any;
  postId: string;
}

export const PostModal = ({ postId, viewPostModal }: Props) => {
  const loggedInUser = useSelector(selectUserDetail);
  const [post, setPost] = useState<any>(null);
  const [isPostViewed, setIsPostViewed] = useState<string>("");
  const userReactionOnPost: "like" | "dislike" | null =
    post?.reactions?.[0]?.reactionType || null;

  const getPostById = async () => {
    await axiosGet(`/post/${postId}`)
      .then((response) => {
        if (response.status === 200) {
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
      if (response?.status === 200) {
        setIsPostViewed(postId);
      }
    } catch (error) {
      setIsPostViewed("");
      console.log("error adding post view", error);
    }
  };

  const addReaction = async (
    reactionType: "like" | "dislike",
    targetType: "post" | "comment",
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
      // console.log(parentId);
      // // return;

      if (reaction.status === 200) {
        setPost((prevState: any) => {
          const updatedState = { ...prevState }; // Copy of the state to modify

          if (targetType === "post") {
            const { likeCount, dislikeCount } = updatedState;

            // Update post-level like and dislike counts
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

            // Update comment-level like and dislike counts
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
      }
    } catch (error) {
      console.log("Failed to add reaction", error);
    }
  };

  useEffect(() => {
    if (!viewPostModal?.isOpen) return;
    getPostById();
    isPostViewed !== postId && addPostViewByAPI();
  }, [postId, viewPostModal.isOpen]);

  if (!postId || !post) return <></>;

  return (
    <Modal
      // headerTitle="Post"
      onClose={viewPostModal.closeModal}
      visible={viewPostModal.isOpen}
      showCloseIcon
      customHeader={
        <div className="bg-primary p-2 px-4 font-sans">
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
                ? npiToDefinition[
                    post.forumType as keyof typeof npiToDefinition
                  ] || post?.forumType
                : "-"}
            </b>
          </div>
        </div>
      }
      showFooter={false}
      modalClassName="!w-2/4 !bg-primary-dark h-full"
      // modalBodyClassName="flex flex-auto p-4 !h-full overflow-y-auto"
      // closeOnEscape
      closeOnOutsideClick
    >
      <div className="flex flex-col flex-auto text-white">
        <div className="flex flex-auto gap-4">
          <div className="flex flex-col gap-2 items-center">
            <span
              onClick={() =>
                userReactionOnPost !== "like" &&
                addReaction("like", "post", postId)
              }
              className={`w-7 h-7 ease-in-out duration-300 rounded-md flex justify-center items-center border-2 ${
                userReactionOnPost === "like"
                  ? "border-primary text-primary"
                  : "border-white/50 text-white/50 cursor-pointer"
              } `}
            >
              <FontAwesomeIcon icon={faThumbsUp} size="sm" />
            </span>
            <span>{post?.likeCount - post?.dislikeCount}</span>
            <span
              onClick={() =>
                userReactionOnPost !== "dislike" &&
                addReaction("dislike", "post", postId)
              }
              className={`w-7 h-7 rounded-md flex justify-center items-center border-2 ${
                userReactionOnPost === "dislike"
                  ? "border-primary text-primary"
                  : "border-white/50 text-white/50 cursor-pointer"
              } `}
            >
              <FontAwesomeIcon icon={faThumbsDown} />
            </span>
          </div>
          <div className="flex flex-auto flex-col gap-1">
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
                • Published on {moment(post?.createdAt).format("DD/MM/YYYY")}
              </span>
              <span className="w-5 h-5 bg-primary/60 flex items-center justify-center rounded-full">
                <FontAwesomeIcon
                  icon={post?.isisPrivate ? faLock : faEye}
                  className="shadow-sm animate-fade-in-down"
                  size="xs"
                />
              </span>
              <span className="flex flex-1 justify-end text-white">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </span>
            </div>
            <span className="text-white text-xl">{post?.title}</span>
            <div className="flex gap-2 flex-wrap flex-auto">
              {post?.categories?.map((category: any) => (
                <span
                  key={category?._id}
                  className="text-xs p-1 px-2 bg-primary/25 text-white/50 rounded-md capitalize"
                >
                  {category?.name}
                </span>
              ))}
              {post?.tags?.map((tag: any) => (
                <span
                  key={tag._id}
                  className="text-xs p-1 px-2 bg-[#0F366D] text-white/50 rounded-md capitalize"
                >
                  {tag.name}
                </span>
              ))}
            </div>
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
                <FontAwesomeIcon icon={faCommentDots} /> {post?.commentCount}{" "}
                Comments
              </span>
              <span>
                <FontAwesomeIcon icon={faChartColumn} /> {post?.views} Views
              </span>
            </div>
            <CommentManager
              addReaction={addReaction}
              post={post}
              setPost={setPost}
              getPostById={getPostById}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
