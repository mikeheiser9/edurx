import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowDown,
  faArrowUp,
  faChevronDown,
  faShare,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { getFullName, getStaticImageUrl } from "@/util/helpers";
import Image from "next/image";
import moment from "moment";
import { Button } from "@/components/button";
import MentionInput from "@/components/mentionInput";
import { searchUserByAPI } from "@/service/user.service";
interface Props {
  comment: Comment;
  showBorder?: boolean;
  wrapperClass?: string;
  onSubmitReply?: (commentData?: any) => void;
  onCommentReaction?: (
    reactionType: "like" | "dislike",
    targetType: "post" | "comment",
    targetId: string,
    parentId?: string
  ) => void;
  isChildCard?: boolean;
}

export const CommentCard = ({
  comment,
  showBorder = true,
  wrapperClass = "flex gap-2 flex-col",
  onSubmitReply,
  onCommentReaction,
  isChildCard = false,
}: Props) => {
  const [isReplyBoxVisible, setisReplyBoxVisible] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [commentText, setcommentText] = useState<string>("");
  const userReactionOnComment: "like" | "dislike" | null =
    comment?.reactions?.[0]?.reactionType || null;
  const [userSuggetions, setUserSuggetions] = useState<any[]>([]);
  const [mentions, setMentions] = useState<any[]>([]);
  const [userSuggetionsPagination, setUserSuggetionsPagination] =
    useState<PageDataState>({
      page: 1,
      totalRecords: 0,
    });

  const getTaggedUserIds = (): string[] => {
    return mentions?.map((m) => m?._id);
  };

  const handleReply = () => {
    let parentId = isChildCard ? comment?.parentId : comment?._id;
    if (!commentText && !parentId) return;
    const payload = {
      content: commentText,
      taggedUsers: getTaggedUserIds(),
      parentId,
    };
    console.log(payload);
    onSubmitReply?.(payload);
    setcommentText("");
    setisReplyBoxVisible(false);
  };

  const onReplyClick = () => {
    setcommentText(`@${comment?.userId?.username} `);
    setMentions([comment?.userId]);
    setisReplyBoxVisible(!isReplyBoxVisible);
  };

  const searchUsers = async (
    searchKeyword: string,
    page: number = 1,
    useConcat: boolean = false
  ) => {
    const response = await searchUserByAPI(searchKeyword, {
      page,
      limit: 10,
    });
    if (response.status === 200) {
      setUserSuggetions(
        useConcat
          ? userSuggetions?.concat(response?.data?.data?.records)
          : response?.data?.data?.records
      );
      setUserSuggetionsPagination({
        page: response.data?.data?.currentPage,
        totalRecords: response?.data?.data?.totalRecords,
      });
    }
  };

  const onSelectUser = (user: UserId) => {
    let isExist = mentions?.some((mention) => mention?._id === user?._id);
    if (isExist) return;
    setMentions(mentions?.concat(user));
  };

  const onRemoveMention = (mention: UserId) => {
    setMentions(mentions?.filter((item) => item?._id !== mention?._id));
  };

  const loadMoreUsers = async (searchKeyword: string = "") => {
    await searchUsers(searchKeyword, userSuggetionsPagination.page + 1, true);
  };

  return (
    <div key={comment?._id} className={wrapperClass}>
      <div className="flex gap-2">
        <div className="flex flex-col items-center">
          <span className="w-6 overflow-hidden h-6 justify-center items-center flex bg-white/80 rounded-full">
            {comment?.userId?.profile_img ? (
              <Image
                src={getStaticImageUrl(comment?.userId?.profile_img)}
                width={200}
                height={200}
                alt="user_img"
              />
            ) : (
              <FontAwesomeIcon icon={faUserAlt} />
            )}
          </span>
          {showBorder && (
            <span className="bg-white h-full w-[1px] rounded-sm" />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2 pb-2">
          <span className="text-sm font-semibold lowercase">
            {comment?.userId?.username ||
              getFullName(
                comment?.userId?.first_name,
                comment?.userId?.last_name,
                "_"
              )}{" "}
            {/* <span className="text-white/60">
              {`• ${comment?.views} views • ${moment(
                comment?.createdAt
              ).fromNow()}`}
            </span> */}
            <span className="text-white/60">
              • {moment(comment?.createdAt).fromNow()}
            </span>
          </span>
          <div className="py-2">
            {/* {isChildCard &&
              (comment?.repliedTo?.first_name ||
                comment?.repliedTo?.last_name) && (
                <span className="text-blue-500/70 font-semibold lowercase">{`@${
                  comment?.repliedTo?.username ||
                  getFullName(
                    comment?.repliedTo?.first_name,
                    comment?.repliedTo?.last_name,
                    "_"
                  )
                } `}</span>
              )} */}
            {comment?.content}
          </div>
          <div className="flex gap-6 text-sm items-center text-white/60">
            <span className="flex gap-2 justify-center items-center">
              <FontAwesomeIcon
                icon={faArrowUp}
                className={`${
                  userReactionOnComment === "like"
                    ? "text-primary"
                    : "cursor-pointer"
                } ease-in-out duration-200`}
                onClick={() =>
                  userReactionOnComment !== "like" &&
                  onCommentReaction?.(
                    "like",
                    "comment",
                    comment?._id,
                    isChildCard ? comment?.parentId : undefined
                  )
                }
              />
              &nbsp;
              {(comment?.likeCount || 0) - (comment?.dislikeCount || 0)}
              &nbsp;
              <FontAwesomeIcon
                icon={faArrowDown}
                className={`${
                  userReactionOnComment === "dislike"
                    ? "text-primary"
                    : "cursor-pointer"
                } ease-in-out duration-200`}
                onClick={() =>
                  userReactionOnComment !== "dislike" &&
                  onCommentReaction?.(
                    "dislike",
                    "comment",
                    comment?._id,
                    isChildCard ? comment?.parentId : undefined
                  )
                }
              />
            </span>
            <span className="cursor-pointer" onClick={onReplyClick}>
              <FontAwesomeIcon icon={faCommentDots} />
              &nbsp;Reply
            </span>
            <span>
              <FontAwesomeIcon icon={faShare} />
              &nbsp;Share
            </span>
            {comment?.replies && comment?.replies?.length > 0 && (
              <span
                className="p-1 cursor-pointer px-2 rounded-md border border-primary text-xs text-primary"
                onClick={() => {
                  setShowReplies(!showReplies);
                }}
              >
                {comment?.replies?.length} Replies{" "}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`ease-in-out duration-500 ${
                    showReplies ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
            )}
          </div>
          {isReplyBoxVisible && (
            <div className="flex animate-fade-in-down flex-col w-1/2">
              <MentionInput
                textAreaProps={{
                  placeholder: "What are your thoughts?",
                  className: "text-xs rounded-b-none rounded-t-md !w-full",
                  style: {
                    minBlockSize: "3rem",
                    maxBlockSize: "10rem",
                  },
                }}
                dataOptions={{
                  accessKey: "username",
                  label: ["first_name", "last_name"],
                  primaryKey: "_id",
                  imageKey: "profile_img",
                }}
                setMentions={setMentions}
                setSuggetions={setUserSuggetions}
                useInfiniteScroll
                setValue={setcommentText}
                value={commentText}
                selectedMentions={mentions}
                suggetions={userSuggetions}
                triggerCallback={searchUsers}
                onSelect={onSelectUser}
                onRemoveMention={onRemoveMention}
                infiniteScrollProps={{
                  hasMoreData:
                    userSuggetions?.length <
                    userSuggetionsPagination?.totalRecords,
                  callBack: loadMoreUsers,
                  className:
                    "overflow-y-auto animate-fade-in-down max-h-[15em] text-white bg-primary-dark rounded-md rounded-t-none border-2 border-white/20 flex flex-auto flex-col gap-2 p-2",
                  showLoading: true,
                }}
              />
              <span className="bg-primary rounded-md -mt-1 p-1 w-full flex justify-end rounded-t-none gap-2">
                <Button
                  label="Cancel"
                  className="border border-black text-xs !m-0 w-auto !rounded-xl text-black self-end font-bold hover:!bg-primary-dark hover:text-white ease-in-out duration-300 !py-[.41rem]"
                  onClick={() => setisReplyBoxVisible(false)}
                />
                <Button
                  label="Reply"
                  className="text-xs bg-primary-darker !m-0 w-auto !rounded-xl text-primary self-end font-bold hover:!bg-primary-dark hover:text-white ease-in-out duration-300"
                  type="button"
                  onClick={handleReply}
                />
              </span>
            </div>
          )}
          {showReplies &&
            comment?.replies?.map((reply: any) => (
              <CommentCard
                comment={reply}
                showBorder={false}
                key={reply?._id}
                wrapperClass="flex gap-2 flex-col animate-fade-in-down"
                onSubmitReply={onSubmitReply}
                onCommentReaction={onCommentReaction}
                isChildCard
              />
            ))}
        </div>
      </div>
    </div>
  );
};