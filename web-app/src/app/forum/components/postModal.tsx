import { axiosGet } from "@/axios/config";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { TextArea } from "@/components/textArea";
import { npiToDefinition } from "@/util/constant";
import { getFullName, getStaticImageUrl } from "@/util/helpers";
import {
  faCommentDots,
  faThumbsDown,
  faEye,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faEllipsisVertical,
  faImage,
  faLock,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { CommentCard } from "./commentCard";
import {
  addNewComment,
  addUserReactionByAPI,
  addPostView,
  getComments,
} from "@/service/post.service";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import InfiniteScroll from "@/components/infiniteScroll";

interface Props {
  viewPostModal: any;
  postId: string;
}

export const PostModal = ({ postId, viewPostModal }: Props) => {
  const loggedInUser = useSelector(selectUserDetail);
  const [post, setPost] = useState<any>(null);
  const [commentText, setcommentText] = useState<string>("");
  const [commentPagination, setcommentPagination] = useState<PageDataState>({
    page: 1,
    totalRecords: 0,
  });
  const [isPostViewed, setIsPostViewed] = useState<string>("");
  const userReactionOnPost: "like" | "dislike" | null =
    post?.reactions?.[0]?.reactionType || null;

  const onCommentSubmit = async (commentData?: any) => {
    try {
      if (!loggedInUser?._id) return;
      const payload = {
        content: commentText,
        userId: loggedInUser?._id,
        postId: post?._id,
        taggedUsers: [],
        ...commentData,
      };
      const response = await addNewComment(payload);
      if (response?.status === 200) {
        setcommentText("");
        getPostById(); // It'll update UI after adding comment
      }
    } catch (error) {
      console.log("Failed to add comment", error);
    }
  };

  const onLoadMoreComment = async (page: number) => {
    try {
      const response = await getComments(post?._id, {
        page: page,
        limit: 10,
      });
      if (response?.status === 200) {
        let comments = response?.data?.data?.comments?.data;
        let totalRecords =
          response?.data?.data?.comments?.metadata?.totalRecords ?? 0;
        setPost((preState: any) => {
          return {
            ...preState,
            comments: preState?.comments?.concat(comments),
          };
        });
        setcommentPagination({ page, totalRecords });
      }
    } catch (error) {
      console.log("Failed to load  comment", error);
    }
  };

  console.log("comments", post?.comments);
  console.log({ post });

  const getPostById = async () => {
    await axiosGet(`/post/${postId}`)
      .then((response) => {
        if (response.status === 200) {
          setPost(response?.data?.data);
          setcommentPagination({
            page: 1,
            totalRecords: response?.data?.data?.commentCount ?? 0,
          });
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
    targetId: string
  ) => {
    try {
      const payload = {
        reactionType,
        targetType,
        userId: loggedInUser?._id,
        [targetType === "post" ? "postId" : "commentId"]: targetId,
      };
      const reaction = await addUserReactionByAPI(payload);

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
              (item: any) => item?._id === reaction.data.data.commentId
            );
            if (indexOfUpdatedComment === -1) return;
            const updatedComment = {
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

            updatedState.comments[indexOfUpdatedComment] = updatedComment;
          }

          return updatedState;
        });
      }
      console.log(reaction);
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
  console.log(isPostViewed);

  return (
    <Modal
      headerTitle="Post"
      onClose={viewPostModal.closeModal}
      visible={viewPostModal.isOpen}
      showCloseIcon
      showFooter={false}
      modalClassName="!w-2/4 !bg-primary-dark h-full"
      // modalBodyClassName="flex flex-auto p-4 !h-full overflow-y-auto"
      closeOnEscape
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
                  {getFullName(
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
            <TextArea
              label={
                <span className="text-white font-light text-xs">
                  Comment as{" "}
                  <b className="font-mono">
                    {getFullName(
                      post?.userId?.first_name,
                      post?.userId?.last_name,
                      "_"
                    )}
                  </b>
                </span>
              }
              onChange={(e) => setcommentText(e.target.value)}
              value={commentText}
              placeholder="What are your thoughts?"
              className="text-xs rounded-b-none rounded-t-md"
              style={{
                minBlockSize: "4rem",
              }}
            />
            <span className="bg-primary rounded-md -mt-1 p-1 flex justify-end rounded-t-none">
              <Button
                label="Comment"
                className="text-xs bg-primary-darker !m-0 w-auto !rounded-xl text-primary self-end font-bold hover:!bg-primary-dark hover:text-white ease-in-out duration-300"
                onClick={() => onCommentSubmit()}
              />
            </span>
            <hr className="my-6 border-white/60 border rounded-md" />
            <div className="flex">
              <span className="text-xl">{post?.commentCount} Responses</span>
            </div>
            <InfiniteScroll
              className="py-4 rounded-md h-full max-h-[50vh]"
              hasMoreData={
                commentPagination?.totalRecords > post?.comments?.length
              }
              callBack={() => onLoadMoreComment(commentPagination?.page + 1)}
            >
              {post?.comments?.map((comment: any) => (
                <CommentCard
                  comment={comment}
                  key={comment?._id}
                  onSubmitReply={onCommentSubmit}
                  onCommentReaction={addReaction}
                />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </Modal>
  );
};
