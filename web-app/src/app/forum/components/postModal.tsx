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
import Link from "next/link";
import { AddPost } from "./addPost";
import { Button } from "@/components/button";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  viewPostModal: UseModalType;
  postId: string;
}

const getIsVotingClosed = (closingDate: any): boolean => {
  const today = moment(); // Current date
  const endDate = moment(closingDate, "YYYY-MM-DD");

  // Check if the current date is after the closing date
  const votingClosed = today.isAfter(endDate);

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
  const userReactionOnPost: UserReaction | null = post?.reactions?.[0] || null;
  const isSelfPost: boolean | undefined =
    loggedInUser?._id === post?.userId?.id;
  const requestStatus: PostRequestStatus | null =
    post?.userAccessRequests?.find(
      (req: any) => req?.userId === loggedInUser?._id
    )?.status || null;
  const isVotingClosed: boolean = getIsVotingClosed(
    moment(post?.publishedOn).add("days", post?.votingLength ?? 0)
  );
  const userFollowsPost: userPostFollowList | undefined =
    post?.userPostFollowers?.find(
      (i) => i?.userId === loggedInUser?._id && i?.postId === post?._id
    );
  const editPostModal = useModal();

  const returnButtonWithAppropriateLabel = () => {
    if (userFollowsPost?._id && userFollowsPost?.postId === post?._id) {
      setButtonLabel("Following");
    } else if (post?.isPrivate) {
      if (requestStatus) {
        setButtonLabel(
          requestStatus === "pending"
            ? "Requested"
            : requestStatus === "denied"
            ? "Rejected"
            : "Following"
        );
      } else {
        setButtonLabel("Request Access");
      }
    } else {
      setButtonLabel("Follow");
    }
  };

  useEffect(() => {
    if (post) {
      returnButtonWithAppropriateLabel();
    }
  }, [post]);

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
    parentId?: string,
    reactionId?: string
  ) => {
    try {
      const payload = {
        reactionType,
        targetType,
        userId: loggedInUser?._id,
        [targetType === "post" ? "postId" : "commentId"]: targetId,
        ...(reactionId && { _id: reactionId }),
      };
      const reaction = await addUserReactionByAPI(payload);

      if (reaction.status === responseCodes.SUCCESS) {
        getPostById();
      } else throw new Error("Unable to add reaction");
    } catch (error) {
      (error as Error)?.message && showToast.error((error as Error)?.message);
      console.log("Failed to add reaction", error);
    }
  };

  const updateAnimation = (type: any, value: boolean) => {
    setAnimate((preState) => {
      return {
        ...preState,
        [type]: value,
      };
    });
  };

  const reactOnPost = (type: ReactionTypes) => {
    updateAnimation(type, true);
    addReaction(
      userReactionOnPost?.reactionType === type ? null : type,
      "post",
      postId,
      undefined,
      userReactionOnPost?._id
    );
  };

  const requestAccess = async () => {
    // if (requestStatus !== null) return;
    try {
      if (!requestStatus) {
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
      } else if (userFollowsPost) {
        unfollowPostConfirmationModel.openModal();
      }
    } catch (error) {
      showToast?.error((error as Error)?.message || "Something went wrong");
    }
  };

  const HeaderJsx = (): React.ReactElement => (
    <div className="bg-eduDarkGray ipad-under:bg-eduLightGray ipad-under:border-b p-2 px-4 font-sans flex gap-2 h-[50px] items-center ipad-under:text-eduLightBlue">
      <div className="flex md:gap-4 gap-2">
        <span className="flex md:gap-4 gap-2 items-center font-body md:text-[16px] text-[12px]">
          <FontAwesomeIcon icon={faArrowUp} className="font-bold " />
          {(post?.likeCount || 0) - (post?.dislikeCount || 0)}
          <FontAwesomeIcon icon={faArrowDown} className="font-bold" />
          <span>|</span>
          <FontAwesomeIcon icon={faNewspaper} />
        </span>{" "}
        <span className="font-body md:text-[16px] text-[12px]">{`${post?.title?.substring(
          0,
          26
        )} ${post?.title && post?.title?.length > 26 && "..."}`}</span>
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
        className="ml-auto self-center cursor-pointer md:text-[24px] text-xs text-eduBlack"
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
        getPostById();
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

  const onFollowPost = async () => {
    if (!post?._id) return;
    if (post.isPrivate) {
      const payload = {
        status: "pending",
        userId: loggedInUser?._id,
        postId: post?._id,
      };
      const response = await addPrivatePostRequest(payload);
      if (response?.status === responseCodes.SUCCESS) {
        getPostById();
      }
    } else {
      const res = await followPost(post._id, "add");
      if (res.status == responseCodes.SUCCESS) {
        getPostById();
      }
    }
  };

  const onPostActions = () => {
    if (userFollowsPost) {
      unfollowPostConfirmationModel?.openModal();
    } else if (post?.isPrivate && !userFollowsPost) {
      requestAccess();
    } else {
      onFollowPost();
    }
  };

  const onEditPost = () => {
    viewPostModal?.closeModal();
    editPostModal?.openModal();
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
      {editPostModal.isOpen && (
        <AddPost
          addPostModal={editPostModal}
          // fetchPosts={() => {"" as }}
          postDetails={post as any}
          mode="Edit"
        />
      )}
      <Modal
        onClose={viewPostModal.closeModal}
        visible={viewPostModal.isOpen}
        showCloseIcon
        customHeader={<HeaderJsx />}
        showFooter={false}
        modalClassName="h-full md:!rounded-xl  ipad-under:!max-h-[100vh] ipad-under:w-full !rounded-none ipad-under:!min-h-[100vh] md:min-h-[auto] !bg-eduLightGray"
        closeOnOutsideClick
      >
        <React.Fragment>
          {postId && (
            <RequestListModal requestModal={requestModal} postId={postId} />
          )}
          <div className="flex flex-col flex-auto text-eduBlack">
            <div className="flex flex-auto">
              <div className="flex flex-auto flex-col gap-1">
                <div className="flex gap-3">
                  <div className="flex flex-col gap-2 items-center">
                    <span
                      onClick={() => reactOnPost("like")}
                      onAnimationEnd={() => updateAnimation("like", false)}
                      className={`w-7 h-7 ease-in-out duration-300  cursor-pointer rounded-md flex justify-center items-center border-2 ${
                        animate?.like && "animate-wiggle"
                      } ${
                        userReactionOnPost?.reactionType === "like"
                          ? "border-eduYellow text-eduYellow"
                          : "border-eduDarkBlue text-eduDarkBlue"
                      } `}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} size="sm" />
                    </span>
                    <span className="font-body ipad-under:text-xs">
                      {(post?.likeCount || 0) - (post?.dislikeCount || 0)}
                    </span>
                    <span
                      onClick={() => reactOnPost("dislike")}
                      onAnimationEnd={() => updateAnimation("dislike", false)}
                      className={`w-7 h-7 rounded-md flex cursor-pointer justify-center items-center border-2 ${
                        animate?.dislike && "animate-wiggle"
                      } ${
                        userReactionOnPost?.reactionType === "dislike"
                          ? "border-primary text-primary"
                          : "border-eduDarkBlue text-EduDarkBlue"
                      } `}
                    >
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </span>
                  </div>

                  <div className="flex w-[calc(100%_-_40px)]">
                    <div className="flex flex-col flex-1">
                      <div className="flex gap-y-1 gap-x-2 items-center w-full flex-wrap">
                        <div>
                          <span className="md:w-[28px] overflow-hidden md:h-[28px] w-4 h-4 justify-center items-center flex bg-eduDarkGray rounded-full">
                            {post?.userId?.profile_img ? (
                              <Image
                                src={getStaticImageUrl(
                                  post?.userId?.profile_img
                                )}
                                width={200}
                                height={200}
                                alt="user_img"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faImage}
                                className="ipad-under:text-10px w-2.5"
                              />
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-eduDarkBlue md:text-[14px] text-[9px] font-body">
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
                          <span className="text-eduDarkBlue md:text-[14px] text-[9px] font-body">
                            Posted by{" "}
                            <Link
                              href={`/profile/${post?.userId?._id}`}
                              className="font-body font-semibold"
                            >
                              {post?.userId?.username ||
                                getFullName(
                                  post?.userId?.first_name,
                                  post?.userId?.last_name,
                                  "_"
                                )}
                            </Link>
                          </span>
                        </div>
                        <div>
                          <span>•</span>
                        </div>
                        <div>
                          <span className="font-body md:text-[14px] text-[9px] text-eduDarkBlue">
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
                      <div className="flex justify-between gap-1">
                        <div className="titleCategory">
                          <div className="pt-1 pb-3">
                            <h2 className="text-eduBlack md:text-[28px] text-[15px] font-medium font-headers leading-none">
                              {post?.title}
                            </h2>
                          </div>
                          <div className="flex gap-2 flex-wrap flex-auto items-center">
                            {post?.categories?.map((category: any) => (
                              <div>
                                <span
                                  key={category?._id}
                                  className="md:text-[12px] ipad-under:bg-white text-[8px] md:py-1 md:px-4 py-0.5 px-2 bg-transparent text-eduDarkBlue rounded-[2px] md:rounded-[5px] border border-eduDarkBlue"
                                >
                                  {category?.name}
                                </span>
                              </div>
                            ))}
                            {post?.filters?.map((filter: any) => (
                              <span
                                key={filter._id}
                                className="md:text-[12px] text-[8px] ipad-under:leading-normal md:py-1 md:px-4 py-0.5 px-2 ipad-under:bg-white ipad-under:border-eduDarkBlue ipad-under:text-eduDarkBlue bg-eduDarkGray md:rounded-[5px] border"
                              >
                                {filter.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="PostBTN">
                          {isSelfPost ? (
                            <div className="flex gap-2">
                              <Button
                                label="Edit"
                                onClick={onEditPost}
                                className="w-auto m-auto px-4"
                              />
                              {/* {post?.isPrivate && (
                          <ReviewRequestButton
                            count={post?.postRequests?.length || 0}
                            onClick={requestModal?.openModal}
                          />
                        )} */}
                            </div>
                          ) : (
                            <button
                              id="buttonLabel"
                              // onClick={requestAccess}
                              onClick={onPostActions}
                              className={`p-2 px-4 md:text-sm text-10px text-black bg-white rounded-md w-auto font-medium bg-transparent border-eduBlack border-[1.5px] py-1 m-auto font-body transition-colors duration-500 hover:bg-eduBlack hover:text-white disabled:opacity-70 ${
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
                        </div>
                      </div>
                    </div>
                  </div>
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
                            className="text-eduBlack -mx-3 post-body ipad-under:text-xs"
                            value={post?.content}
                            theme="bubble"
                            readOnly
                          />
                        )}
                        <div className="flex flex-1 gap-4 py-4 text-eduDarkBlue items-center">
                          <span className="font-body md:text-[14px] text-10px">
                            <FontAwesomeIcon
                              className="md:text-[18px] text-10px"
                              icon={faCommentDots}
                            />{" "}
                            {post?.commentCount} Comments
                          </span>
                          <span className="font-body md:text-[14px] text-10px">
                            <FontAwesomeIcon
                              className="md:text-[18px] text-10px"
                              icon={faChartColumn}
                            />{" "}
                            {post?.views} Views
                          </span>
                        </div>
                        {post.postType == "poll" && (
                          <div className="flex flex-col w-full gap-2 text-eduLightBlue font-[400] mb-2 ">
                            {post.options?.map((option: string) =>
                              isVotingClosed ? (
                                <ProgressBar
                                  wrapperClass={
                                    "h-10 rounded text-md cursor-pointer border border-eduDarkGray"
                                  }
                                  onClick={() => handleVote(post._id, option)}
                                  key={option}
                                  label={
                                    <span className="p-4 font-medium flex justify-center items-center gap-3 whitespace-nowrap">
                                      <b>
                                        {Math.round(
                                          getPercentageForOption(option)
                                        )}
                                        %
                                      </b>
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
                                    userChoosenOption?.choosenOption ===
                                      option && "!bg-eduYellow"
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
                                {moment(post.publishedOn).add(
                                  "day",
                                  Number(post?.votingLength)
                                ) < moment()
                                  ? "final Results"
                                  : `${
                                      moment(post?.publishedOn)
                                        .add("day", Number(post?.votingLength))
                                        .diff(moment(), "day") + 1
                                    } days left`}
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
            modalClassName="md:!w-auto md:min-w-[30rem]  !rounded-lg"
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
