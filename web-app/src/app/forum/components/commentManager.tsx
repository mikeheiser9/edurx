import InfiniteScroll from "@/components/infiniteScroll";
import React, { SetStateAction, useState } from "react";
import { CommentCard } from "./commentCard";
import { addNewComment, getComments } from "@/service/post.service";
import { Button } from "@/components/button";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { getFullName } from "@/util/helpers";
import MentionInput from "@/components/mentionInput";
import { searchUserByAPI } from "@/service/user.service";
import { responseCodes } from "@/util/constant";

interface CommentManagerProps {
  post: any;
  setPost: React.Dispatch<SetStateAction<any>>;
  getPostById?: () => void;
  addReaction: (
    reactionType: "like" | "dislike",
    targetType: "post" | "comment",
    targetId: string,
    parentId?: string
  ) => void;
}

export const CommentManager = ({
  post,
  setPost,
  getPostById,
  addReaction,
}: CommentManagerProps) => {
  const loggedInUser = useSelector(selectUserDetail);
  const [commentText, setcommentText] = useState<string>("");
  const [commentPagination, setcommentPagination] = useState<PageDataState>({
    page: 1,
    totalRecords: post?.commentCount ?? 0,
  });
  const [userSuggetions, setUserSuggetions] = useState<any[]>([]);
  const [mentions, setMentions] = useState<any[]>([]);
  const [userSuggetionsPagination, setUserSuggetionsPagination] =
    useState<PageDataState>({
      page: 1,
      totalRecords: 0,
    });

  const onLoadMoreComment = async (page: number) => {
    try {
      const response = await getComments(post?._id, {
        page: page,
        limit: 10,
      });
      if (response?.status === responseCodes.SUCCESS) {
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

  const onCommentSubmit = async (commentData?: any) => {
    try {
      if (!loggedInUser?._id) return;
      const payload = {
        content: commentText,
        userId: loggedInUser?._id,
        postId: post?._id,
        taggedUsers: getTaggedUserIds(),
        ...commentData,
      };
      console.log(payload);
      // return

      const response = await addNewComment(payload);
      if (response?.status === responseCodes.SUCCESS) {
        setcommentText("");
        getPostById?.(); // It'll update UI after adding comment
      }
    } catch (error) {
      console.log("Failed to add comment", error);
    }
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
    console.log(response);
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

  const getTaggedUserIds = (): string[] => {
    return mentions?.map((m) => m?._id);
  };

  return (
    <>
      <MentionInput
        value={commentText}
        setValue={setcommentText}
        onSelect={onSelectUser}
        onRemoveMention={onRemoveMention}
        triggerCallback={searchUsers}
        setSuggetions={setUserSuggetions}
        dataOptions={{
          accessKey: "username",
          label: ["first_name", "last_name"],
          primaryKey: "_id",
          imageKey: "profile_img",
        }}
        suggetions={userSuggetions}
        selectedMentions={mentions}
        setMentions={setMentions}
        useInfiniteScroll
        hightlightOnSearch
        infiniteScrollProps={{
          hasMoreData:
            userSuggetions?.length < userSuggetionsPagination?.totalRecords,
          callBack: loadMoreUsers,
          className:
            "overflow-y-auto animate-fade-in-down max-h-[15em] text-white bg-primary-dark rounded-md rounded-t-none border-2 border-white/20 flex flex-auto flex-col gap-2 p-2",
          showLoading: true,
        }}
        textAreaProps={{
          label: (
            <span className="text-eduBlack text-[12px] font-body font-medium">
              Comment as
              <b className="font-body ml-[5px]">
                {post?.userId?.username ||
                  getFullName(
                    post?.userId?.first_name,
                    post?.userId?.last_name,
                    "_"
                  )}
              </b>
            </span>
          ),
          style: {
            minBlockSize: "8rem",
          },
          className: "text-[16px] w-full p-4 bg-eduDarkGray text-eduBlack",
          placeholder: "What are your thoughts? (Type @ to mention a user)",
        }}
      />
      <span className="bg-eduLightBlue rounded-md p-2 flex justify-end rounded-t-none mt-[-15px]">
        <Button
          label="Comment"
          className="!text-[12px] !m-0 w-[150px] !rounded-[10px] text-white self-end border-white hover:!bg-eduBlack hover:text-white ease-in-out duration-300"
          onClick={() => onCommentSubmit()}
        />
      </span>
      <hr className="my-6 border-eduBlack/60 border rounded-md" />
      <div className="flex">
        <span className="text-[28px] font-headers font-semibold">{post?.commentCount} Responses</span>
      </div>
      <InfiniteScroll
        className="py-4 rounded-[10px] h-full max-h-[50vh]"
        hasMoreData={commentPagination?.totalRecords > post?.comments?.length}
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
    </>
  );
};
