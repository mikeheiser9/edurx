import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowDown,
  faArrowUp,
  faChevronDown,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { getFullName, getStaticImageUrl } from "@/util/helpers";
import Image from "next/image";
import moment from "moment";
import { Button } from "@/components/button";
import MentionInput from "@/components/mentionInput";
import { searchUserByAPI } from "@/service/user.service";
import replaceTaggedUsers from "../../../components/replaceTags";
import { responseCodes } from "@/util/constant";
import { showToast } from "@/components/toast";
interface Props {
  comment: Comment;
  showBorder?: boolean;
  wrapperClass?: string;
  onSubmitReply?: (commentData?: any) => void;
  onCommentReaction?: (
    reactionType: ReactionTypes,
    targetType: TargetTypes,
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
  const userReactionOnComment: ReactionTypes | null =
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
    let prefix = `@${comment?.userId?.username}`;
    let isReplyMentionExist =
      commentText?.includes(prefix) &&
      mentions?.some((m) => m?._id === comment?.userId?._id);
    const payload = {
      content: isReplyMentionExist ? commentText : `${prefix} ${commentText}`,
      taggedUsers: getTaggedUserIds()?.concat(
        !isReplyMentionExist && comment?.userId?._id ? comment?.userId?._id : []
      ),
      parentId,
    };
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
    try {
      const response = await searchUserByAPI(searchKeyword, {
        page,
        limit: 10,
      });
      if (response.status === responseCodes.SUCCESS) {
        setUserSuggetions(
          useConcat
            ? userSuggetions?.concat(response?.data?.data?.records)
            : response?.data?.data?.records
        );
        setUserSuggetionsPagination({
          page: response.data?.data?.currentPage,
          totalRecords: response?.data?.data?.totalRecords,
        });
      } else throw new Error("Couldn't search user");
    } catch (error) {
      (error as Error)?.message && showToast?.error((error as Error)?.message);
      console.log("Failed to search users", error);
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

  const reactOnComment = (type: ReactionTypes) => {
    if (userReactionOnComment === type) return;
    onCommentReaction?.(
      type,
      "comment",
      comment?._id,
      isChildCard ? comment?.parentId : undefined
    );
  };

  return (
    <div key={comment?._id} className={wrapperClass}>
      <div className="flex gap-2">
        <div className="flex flex-col items-center">
          <span className="w-[32px] overflow-hidden h-[32px] justify-center items-center flex bg-white/80 rounded-full">
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
            <span className="bg-eduDarkGray h-full w-[1px] rounded-sm" />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2 pb-2">
          <span className="text-[14px] font-semibold lowercase font-body">
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
            <span className="text-eduBlack/60 font-body text-[12px]">
              • {moment(comment?.createdAt).fromNow()}
            </span>
          </span>
          <div className="py-2 font-body text-[16px]">
            {comment.content &&
              replaceTaggedUsers({
                content: comment.content,
                taggedUsers: comment?.taggedUsers ?? [],
              })}
          </div>
          <div className="flex gap-6 text-[14px] items-center text-eduBlack/60">
            <span className="flex gap-2 justify-center items-center font-body">
              <FontAwesomeIcon
                icon={faArrowUp}
                className={`${
                  userReactionOnComment === "like"
                    ? "text-eduYellow cursor-pointer"
                    : "text-eduBlack/60 cursor-pointer"
                } ease-in-out duration-200`}
                onClick={() => reactOnComment("like")}
              />
              &nbsp;
              {(comment?.likeCount || 0) - (comment?.dislikeCount || 0)}
              &nbsp;
              <FontAwesomeIcon
                icon={faArrowDown}
                className={`${
                  userReactionOnComment === "dislike"
                    ? "text-eduYellow cursor-pointer"
                    : "text-eduBlack/60 cursor-pointer"
                } ease-in-out duration-200`}
                onClick={() => reactOnComment("dislike")}
              />
            </span>
            <span className="cursor-pointer font-body" onClick={onReplyClick}>
              <FontAwesomeIcon icon={faCommentDots} />
              &nbsp;Reply
            </span>
            {/* <span className="cursor-not-allowed font-body text-eduBlack/30">
              <FontAwesomeIcon icon={faShare} />
              &nbsp;Share
            </span> */}
            {comment?.replies && comment?.replies?.length > 0 && (
              <span
                className="p-1 cursor-pointer px-2 rounded-[10px] border border-eduBlack text-[14px] text-eduBlack font-body"
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
                    "overflow-y-auto bg-eduDarkGray animate-fade-in-down max-h-[15em] text-eduBlack rounded-[10px] rounded-t-none border-2 border-white/20 flex flex-auto flex-col gap-2 p-2",
                  showLoading: true,
                }}
              />
              <span className="bg-eduLightBlue rounded-[10px] -mt-2 p-2 w-full flex justify-end rounded-t-none gap-4">
                <Button
                  label="Cancel"
                  className="border border-white w-[80px] !text-[12px] !m-0 !rounded-[10px] text-white self-end hover:!bg-eduBlack ease-in-out duration-300 hover:!border-eduBlack"
                  onClick={() => setisReplyBoxVisible(false)}
                />
                <Button
                  label="Reply"
                  className="border border-white w-[80px] !text-[12px] !m-0 !rounded-[10px] text-white self-end hover:!bg-eduBlack ease-in-out duration-300 hover:!border-eduBlack"
                  type="button"
                  onClick={handleReply}
                />
              </span>
            </div>
          )}
          {showReplies &&
            comment?.replies?.map((reply) => (
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
