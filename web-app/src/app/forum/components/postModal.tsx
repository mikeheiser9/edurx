import { axiosGet } from "@/axios/config";
import { Modal } from "@/components/modal";
import { npiToDefinition, postLabelType, responseCodes } from "@/util/constant";
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
  faCheckCircle,
  faImage,
  faLock,
  faNewspaper,
  faThumbsUp,
  faX,
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
  followPost,
  handleVoteOnPollPost,
} from "@/service/post.service";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import dynamic from "next/dynamic";
import { CommentManager } from "./commentManager";
import { showToast } from "@/components/toast";
import { DummyPost } from "./dummyComps/dummyPost";
import { ReviewRequestButton } from "./sections";
import { useModal } from "@/hooks";
import { RequestListModal } from "./requestListModal";
import "react-quill/dist/quill.snow.css";
import UnFollowConfirmation from "./unFollowConfirmation";
import { ProgressBar } from "@/components/progressBar";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  viewPostModal: UseModalType;
  postId: string;
}

const getIsVotingClosed = (closingDate: any): boolean => {
  const today = moment(); // Current date
  const endDate = moment(closingDate, "YYYY-MM-DD");

  // Check if the current date is after the closing date
  const votingClosed = today.isAfter(endDate, "day");

  return votingClosed;
};

export const PostModal = ({ postId, viewPostModal }: Props) => {
  const loggedInUser = useSelector(selectUserDetail);
  const [post, setPost] = useState<PostInterface>();
  const [isPostViewed, setIsPostViewed] = useState<string>("");
  const requestModal = useModal();
  const unfollowPostConfirmationModel = useModal();
  const [animate, setAnimate] = useState<{ like: boolean; dislike: boolean }>({
    like: false,
    dislike: false,
  });
  const [buttonLabel, setButtonLabel] = useState("");
  const userChoosenOption = post?.votingInfo?.find(
    (i) => i?.userId === loggedInUser?._id
  );
  const userReactionOnPost: ReactionTypes | null =
    post?.reactions?.[0]?.reactionType || null;
  const isSelfPost: boolean | undefined =
    loggedInUser?._id === post?.userId?.id;
  const requestStatus: PostRequestStatus | null =
    post?.userAccessRequests?.find(
      (req: any) => req?.userId === loggedInUser?._id
    )?.status || null;
  const isVotingClosed: boolean = getIsVotingClosed(
    moment(post?.publishedOn).add("days", post?.votingLength ?? 0)
  );

  const returnButtonWithAppropriateLabel = () => {
    if (post) {
      if (post.isPrivate) {
        if (post.userId?._id == loggedInUser._id)
          setButtonLabel(postLabelType["Review Requests"]);
      }
      if (post?.userAccessRequests?.[0]) {
        if (post?.userAccessRequests?.[0].userId == loggedInUser._id) {
          if (post?.userAccessRequests?.[0].status == "accepted") {
            setButtonLabel(postLabelType["Following"]);
          } else if (post?.userAccessRequests?.[0].status == "pending") {
            setButtonLabel(postLabelType["Requested"]);
          }
        }
      } else {
        setButtonLabel(postLabelType["Follow"]);
      }
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
    // if (requestStatus !== null) return;
    try {
      if (buttonLabel == "Follow") {
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
      } else if (buttonLabel == "Unfollow") {
        unfollowPostConfirmationModel.openModal();
      }
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
        icon={faX}
        onClick={viewPostModal.closeModal}
        className="ml-auto font-bold self-center cursor-pointer text-eduBlack"
      />
    </div>
  );

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

  const unFollowPost = async () => {
    if (!post?._id) return;
    const res = await followPost(post._id, "remove");
    if (res) {
      if (res.status == responseCodes.SUCCESS) {
        setButtonLabel("Follow");
        unfollowPostConfirmationModel.closeModal();
      }
    }
  };

  const handleVote = async (postId: string, vote: string) => {
    if (isVotingClosed) return;
    const voteResp = await handleVoteOnPollPost(postId, { option: vote });
    if (voteResp.data.response_type == "Success") {
      getPostById();
    }
  };

  const getPercentageForOption = (choosenOption: string): number => {
    const filteredVotes = post?.votingInfo?.filter(
      (vote) => vote?.choosenOption === choosenOption
    );
    const totalVotes = post?.votingInfo?.length || 0;
    const optionVotes = filteredVotes?.length || 0;

    if (totalVotes === 0) {
      return 0; // To avoid division by zero
    }

    return (optionVotes / totalVotes) * 100;
  };

  useEffect(() => {
    if (!viewPostModal?.isOpen) return;
    getPostById();
    isPostViewed !== postId && addPostViewByAPI();
  }, [postId, viewPostModal.isOpen]);

  useEffect(() => {
    if (post) {
      returnButtonWithAppropriateLabel();
    }
  }, [post]);

  if (!postId || !post) return <></>;

  return (
    <>
      <Modal
        onClose={viewPostModal.closeModal}
        visible={viewPostModal.isOpen}
        showCloseIcon
        customHeader={<HeaderJsx />}
        showFooter={false}
        modalClassName="h-full"
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
                      {post?.filters?.map((filter: any) => (
                        <span
                          key={filter._id}
                          className="text-[12px] p-2 px-4 bg-eduDarkGray rounded-[10px]"
                        >
                          {filter.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {post?.isPrivate && (
                    <>
                      {isSelfPost ? (
                        <ReviewRequestButton
                          onClick={requestModal.openModal}
                          count={post?.userAccessRequestCount || 0}
                        />
                      ) : (
                        <button
                          id="buttonLabel"
                          onClick={requestAccess}
                          className={`p-2 px-4 text-sm text-black bg-white rounded-md w-auto font-medium bg-transparent border-eduBlack border-[1.5px] py-1 m-auto font-body transition-colors duration-500 hover:bg-eduBlack hover:text-white disabled:opacity-70 ${
                            buttonLabel == "Requested" &&
                            "!bg-eduLightBlue text-white"
                          }`}
                          onMouseEnter={() => {
                            if (buttonLabel == "Following") {
                              setButtonLabel("Unfollow");
                            }
                          }}
                          onMouseLeave={() => {
                            if (buttonLabel == "Unfollow") {
                              setButtonLabel("Following");
                            }
                          }}
                          disabled={buttonLabel == "Requested"}
                        >
                          {buttonLabel}
                        </button>
                      )}
                    </>
                  )}
                </div>
                <>
                  {post?.isPrivate &&
                  !isSelfPost &&
                  requestStatus !== "accepted" ? (
                    <DummyPost />
                  ) : (
                    <>
                      {post?.content && (
                        <ReactQuill
                          className="text-eduBlack -mx-3 post-body"
                          value={post?.content}
                          theme="bubble"
                          readOnly
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
                      {post.postType == "poll" && (
                        <div className="flex flex-col w-full gap-2 text-eduLightBlue font-[400]">
                          {post.options?.map((option: string) =>
                            isVotingClosed ? (
                              <ProgressBar
                                wrapperClass={
                                  "h-10 rounded text-md cursor-pointer border border-eduDarkGray"
                                }
                                onClick={() => handleVote(post._id, option)}
                                key={option}
                                label={
                                  <span className="p-4 font-medium flex justify-center items-center gap-3">
                                    <b>{getPercentageForOption(option)}%</b>
                                    {option}
                                    {userChoosenOption?.choosenOption ===
                                      option && (
                                      <FontAwesomeIcon icon={faCheckCircle} />
                                    )}
                                  </span>
                                }
                                progress={getPercentageForOption(option)}
                                filledClass={`!justify-start ${
                                  userChoosenOption?.choosenOption === option
                                    ? "bg-eduYellow"
                                    : "!bg-eduDarkGray"
                                }`}
                              />
                            ) : (
                              <span
                                className={`border-[1px] p-2 rounded border-eduLightBlue text-center cursor-pointer ${
                                  userChoosenOption?.choosenOption === option &&
                                  "!bg-eduYellow"
                                }`}
                                onClick={() => handleVote(post._id, option)}
                              >
                                {option}
                              </span>
                            )
                          )}
                          <div>
                            <span>{post?.votingInfo?.length} votes - </span>
                            <span>
                              {moment(post?.publishedOn)
                                .add("days", Number(post?.votingLength))
                                .diff(moment(), "days")}{" "}
                              days left
                            </span>
                          </div>
                        </div>
                      )}
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
        </React.Fragment>
      </Modal>
    </>
  );
};
