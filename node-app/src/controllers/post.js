import { Types, isValidObjectId } from "mongoose";
import {
  addCategoryFilter,
  addComment,
  addPostAccessRequest,
  addReaction,
  addViews,
  createNewPost,
  deleteOnePostRequest,
  deletePostRequest,
  findCategoryOrPostByCondition,
  findPostById,
  getCommentsByPostId,
  getPostById,
  getPosts,
  getRequestsByPostId,
  searchCategoryFilterByName,
  updatePostByCondition,
  updatePostById,
  updatePostRequests,
} from "../repository/post.js";
import {
  generalResponse,
  getAllowedForumAccessBasedOnRoleAndNpiDesignation,
} from "../util/commonFunctions.js";
import { responseCodes, responseTypes } from "../util/constant.js";
import {
  findFollowerById,
  findFollowersOfPostById,
  findUserFollowPostDetails,
  getBasicProfile,
  insertFollowPost,
  insertFollowPostMultiple,
  removeFollowPost,
} from "../repository/user.js";
import {
  findNotificationByCondition,
  insertNotification,
} from "../repository/notification.js";
import { findCommentById } from "../repository/comment.js";
import { postRequestModal } from "../model/post/postAccessRequest.js";
import { postModal } from "../model/post/post.js";
import moment from "moment";
import {
  deleteVoteById,
  insertPollVote,
  updateVoteById,
} from "../repository/poll.js";

const createPost = async (req, res) => {
  try {
    const { postStatus } = req.body;
    const post = await createNewPost(req.body);
    const followers = await findFollowerById(req.user._id);
    if (followers && followers.length > 0 && postStatus === "published") {
      const notificationReceiverUserIds = followers.map((follower) => {
        return follower.userId;
      });
      await insertNotification({
        type: "user_you_follow_published_a_new_post",
        contentId: post._id,
        destinationId: notificationReceiverUserIds,
        eventTime: new Date(),
        sourceId: req.user._id,
        multipleInsert: true,
        whatIsMultiple: "destinationId",
      });
    }
    generalResponse(res, 200, "OK", "Post created", post, null);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, null, true);
  }
};

const searchPostMetaLabel = async (req, res) => {
  try {
    const { name, type, page, limit, forumType } = req.query;
    console.log({ data: req.query });
    const forum = [];
    if (!forumType || forumType == "All Forums") {
      const role = req.user.role;
      const npi_designation = req.user.npi_designation;
      forum.push(
        ...getAllowedForumAccessBasedOnRoleAndNpiDesignation(
          role,
          npi_designation
        )
      );
    } else {
      forum.push(forumType);
    }
    const searchResult = await searchCategoryFilterByName(
      name,
      type,
      page,
      limit,
      forum
    );
    let message = searchResult.records.length
      ? "records found"
      : "No records found";
    return generalResponse(res, 200, "success", message, searchResult);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

const addPostMetaLabel = async (req, res) => {
  try {
    const { metaLabel } = req.params;
    const { forumType, name } = req.body;
    const categegoryOrFilterToBeInserted = [];
    for (let i = 0; i < forumType.length; i++) {
      const data = {
        forumType: forumType[i],
        name: name,
        type: metaLabel,
      };
      categegoryOrFilterToBeInserted.push(data);
      const res = await findCategoryOrPostByCondition(data);
      if (res) {
        throw `${name} already exists in ${metaLabel}`;
      }
    }
    const response = await addCategoryFilter(categegoryOrFilterToBeInserted);
    return generalResponse(
      res,
      200,
      "success",
      `${metaLabel} created successfully`,
      response
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

const addNewReaction = async (req, res) => {
  try {
    const response = await addReaction(req.body);
    return generalResponse(
      res,
      200,
      "success",
      response.message,
      response.data
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

const addNewComment = async (req, res) => {
  try {
    const { userId, postId, taggedUsers, content, parentId, replyOnDetails } =
      req.body;
    if (userId != req.user._id) {
      throw new Error("something went wrong with token");
    }
    const postDetails = await findPostById(postId);
    if (!postDetails) {
      throw new Error("post doesn't exists with given id");
    }
    if (taggedUsers) {
      for (let i = 0; i < taggedUsers.length; i++) {
        const isExist = await getBasicProfile(taggedUsers[i]);
        if (!isExist) {
          throw new Error("one or more tagged user not exists");
        }
      }
    }
    const newComment = await addComment({
      userId,
      postId,
      taggedUsers,
      content,
      parentId,
    });
    const eventTime = new Date();
    if (!parentId) {
      await insertNotification({
        type: "user_comments_on_your_post",
        sourceId: req.user._id,
        destinationId: postDetails.userId,
        contentId: newComment._id,
        eventTime: eventTime,
      });

      const followers = await findFollowerById(req.user._id);
      if (followers && followers.length > 0) {
        const notificationReceiverUserIds = followers.map((follower) => {
          return follower.userId;
        });
        await insertNotification({
          type: "user_who_you_follow_commented_on_a_post",
          sourceId: req.user._id,
          destinationId: notificationReceiverUserIds,
          contentId: newComment._id,
          eventTime: eventTime,
          multipleInsert: true,
          whatIsMultiple: "destinationId",
        });
      }

      const postFollowers = await findFollowersOfPostById(postDetails._id);
      if (postFollowers && postFollowers.length > 0) {
        const notificationReceiverUserIds = postFollowers.map(
          (postFollower) => {
            return postFollower.userId;
          }
        );
        await insertNotification({
          type: "user_commented_on_a_post_you_follow",
          sourceId: req.user._id,
          destinationId: notificationReceiverUserIds,
          contentId: newComment._id,
          eventTime: eventTime,
          multipleInsert: true,
          whatIsMultiple: "destinationId",
        });
      }
    } else {
      const commentDetails = await findCommentById(replyOnDetails.commentId);
      if (
        !commentDetails ||
        commentDetails.userId != replyOnDetails.commentOwner
      ) {
        throw new Error(
          "something went wrong with comment id or comment owner"
        );
      }
      await insertNotification({
        type: "user_replied_to_your_comment",
        sourceId: req.user._id,
        destinationId: replyOnDetails.commentOwner,
        contentId: newComment._id,
        eventTime: eventTime,
      });
    }
    return generalResponse(
      res,
      200,
      "success",
      "Comment added successfully",
      newComment
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const getPostComments = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const comments = await getCommentsByPostId(
      req.params.postId,
      Number(page || 1),
      Number(limit || 10),
      req?.user?._id
    );
    return generalResponse(
      res,
      200,
      "OK",
      "Comments fetched successfully",
      comments
    );
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await getPostById(req.params.postId, req?.user?._id);
    return generalResponse(res, 200, "OK", "post fetched successfully", post);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const userId = req.route.path === "/forum/user" ? req?.user?._id : null;
    const categoryList = req.query.categories?.split(",");
    const filterList = req.query.filters?.split(",");
    const posts = await getPosts({
      ...req.query,
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
      categories:
        categoryList?.length > 0 &&
        categoryList.map((category) => new Types.ObjectId(category)),
      userId,
      loggedInUser: req.user._id,
      filters:
        filterList?.length > 0 &&
        filterList.map((filter) => new Types.ObjectId(filter)),
      role: req.user.role,
      npi_designation: req.user.npi_designation,
      postStatus: "published",
    });
    return generalResponse(res, 200, "OK", "posts fetched successfully", posts);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const addNewView = async (req, res) => {
  try {
    // view can be single view or multiple
    const response = await addViews(req.body);
    return generalResponse(res, 200, "OK", response.message, response.data);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error);
  }
};

const updatePost = async (req, res) => {
  try {
    const response = await updatePostById(req.body);
    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.OK,
      "Post updated successfully",
      response
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.ERROR,
      responseTypes.ERROR,
      error?.message || "Something went wrong",
      error
    );
  }
};

const addPrivatePostRequest = async (req, res) => {
  try {
    const { postId, userId, status } = req.body;
    if (req.user._id != userId) {
      throw new Error("you are not logged in user");
    }
    const postDetail = await findPostById(postId);
    if (!postDetail) {
      throw new Error("post doesn't exists");
    }
    const response = await addPostAccessRequest(req.body);
    const notificationDetails = await findNotificationByCondition({
      createdBy: userId,
      receiver: postDetail.userId,
      notificationTypeId: postDetail._id,
      notificationType: "user_requested_to_follow_your_private_post",
    });
    if (!notificationDetails) {
      await insertNotification({
        type: "user_requested_to_follow_your_private_post",
        sourceId: userId,
        destinationId: postDetail.userId,
        contentId: postDetail._id,
        eventTime: new Date(),
      });
    }
    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.OK,
      'Post request "created/updated" successfully',
      response
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.INTERNAL_SERVER_ERROR,
      responseTypes.INTERNAL_SERVER_ERROR,
      error?.message || "Something went wrong",
      error
    );
  }
};

// requests of users for private post
const getUserRequests = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit } = req.query;
    const response = await getRequestsByPostId(postId, page, limit);
    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.OK,
      "result successfully fetched",
      response
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.INTERNAL_SERVER_ERROR,
      responseTypes.INTERNAL_SERVER_ERROR,
      error?.message || "Something went wrong",
      error
    );
  }
};

const bulkUpdateRequests = async (req, res) => {
  try {
    const requestIds = req.body.map(
      (requestData) => new Types.ObjectId(requestData._id)
    );
    const postRequestLength = requestIds.length;
    const allDetail = await postRequestModal.aggregate([
      {
        $match: {
          $expr: {
            $in: ["$_id", requestIds],
          },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "postDetails",
        },
      },
      { $unwind: "$postDetails" },
    ]);
    const allDetailLength = allDetail.length;
    if (allDetailLength < postRequestLength) {
      throw new Error("invalid request send");
    }
    const insertFollowPost = [];
    for (let i = 0; i < allDetailLength; i++) {
      insertFollowPost.push({
        userId: allDetail[i].userId,
        postId: allDetail[i].postId,
        requestId: allDetail[i]._id.toString(),
      });
      if (
        allDetail[i].postDetails.userId.toString() != req.user._id.toString()
      ) {
        throw new Error("invalid request send");
      }
    }
    const deniedPostRequestIds = req.body
      .filter((request) => request.status == "denied")
      .map((request) => request._id);
    const acceptedPostRequests = req.body.filter(
      (request) => request.status == "accepted"
    );
    await updatePostRequests(acceptedPostRequests);
    await deletePostRequest({ _id: { $in: deniedPostRequestIds } });
    const insertPostFollowRequest = insertFollowPost
      .filter((follow) => !deniedPostRequestIds.includes(follow.requestId))
      .map((follow) => {
        return {
          userId: follow.userId,
          postId: follow.postId,
        };
      });

    for (let i = 0; i < insertPostFollowRequest.length; i++) {
      if (
        await findUserFollowPostDetails(
          insertPostFollowRequest[i].userId,
          insertPostFollowRequest[i].postId
        )
      ) {
        throw new Error("some of the user already follow this post");
      }
    }
    await insertFollowPostMultiple(insertPostFollowRequest);

    const eventTime = new Date();
    const notificationReceiverUserIds = [];

    allDetail.map((detail) => {
      if (
        req.body.findIndex(
          (request) => request._id == detail._id && request.status == "accepted"
        ) != -1
      ) {
        notificationReceiverUserIds.push(detail.userId);
      }
    });

    // save notification data
    await insertNotification({
      type: "user_approved_your_request_to_follow_a_private_post",
      contentId: allDetail[0].postId,
      eventTime: eventTime,
      sourceId: req.user._id,
      destinationId: notificationReceiverUserIds,
      multipleInsert: true,
      whatIsMultiple: "destinationId",
    });

    // list of user following you post notification
    await insertNotification({
      type: "user_followed_your_post",
      contentId: allDetail[0].postId,
      eventTime: eventTime,
      destinationId: req.user._id,
      sourceId: notificationReceiverUserIds,
      multipleInsert: true,
      whatIsMultiple: "sourceId",
    });

    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.OK,
      "requests updated successfully",
      null
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.INTERNAL_SERVER_ERROR,
      responseTypes.INTERNAL_SERVER_ERROR,
      error?.message || "Something went wrong",
      error,
      true
    );
  }
};

const followPost = async (req, res) => {
  try {
    // check loggedIn user should not be the owner of this post
    const { postId, action } = req.params;
    const postDetail = await findPostById(postId);
    if (!postDetail || postDetail.userId == req.user._id) {
      throw new Error(
        "either forum doesn't exists with id or you are owner of this forum"
      );
    }
    const connectionDetails = await findUserFollowPostDetails(
      req.user._id,
      postId
    );
    if (action == "add") {
      if (connectionDetails) {
        throw new Error("you are already following this forum");
      }
      if (postDetail.isPrivate) {
        throw new Error("private post cannot be followed directly");
      }
      await insertFollowPost(req.user._id.toString(), postId);
      await insertNotification({
        type: "user_followed_your_post",
        sourceId: req.user._id,
        destinationId: postDetail.userId,
        contentId: postDetail._id,
        eventTime: new Date(),
      });
    } else if (action == "remove") {
      if (!connectionDetails) {
        throw new Error("to delete this post user must follow this post");
      }
      if (postDetail.isPrivate) {
        await deleteOnePostRequest({
          $and: [
            {
              userId: req.user._id,
            },
            { postId: new Types.ObjectId(postId) },
          ],
        });
      }
      await removeFollowPost(req.user._id, postId);
    }
    return generalResponse(
      res,
      200,
      "success",
      `${action == "add" ? "Follow" : "Unfollow"} successfully`,
      "",
      true
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.ERROR,
      responseTypes.INTERNAL_SERVER_ERROR,
      error?.message || "Something went wrong",
      error,
      true
    );
  }
};

const updatePostByUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.postId)) {
      throw { message: "invalid postId is passed" };
    }
    const {
      userId,
      forumType,
      postType,
      postStatus,
      title,
      content,
      categories,
      filters,
      options,
      votingLength,
      isPrivate,
    } = req.body;
    const setData = {
      userId,
      postStatus,
      forumType,
      postType,
      title,
      categories,
      filters,
      isPrivate,
      content,
      votingLength,
      options,
    };

    const condition = {
      userId: userId,
      _id: req.params.postId,
      isDeleted: false,
    };
    const currentUserInfor = await findPostById(req.params.postId);
    if (postStatus === "published" && currentUserInfor.postStatus == "draft") {
      setData.publishedOn = new Date();
    }
    await updatePostByCondition(condition, setData);
    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.SUCCESS,
      "post update successfully",
      "",
      true
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.ERROR,
      responseTypes.INTERNAL_SERVER_ERROR,
      error?.message || "Something went wrong",
      error,
      true
    );
  }
};

const pollVote = async (req, res) => {
  try {
    const { postId } = req.params;
    const { option } = req.body;
    const postInfo = await postModal.aggregate([
      {
        $match: {
          $and: [
            { _id: new Types.ObjectId(postId) },
            { postType: "poll" },
            { isDeleted: false },
            { options: option },
          ],
        },
      },
      {
        $project: {
          publishedOn: 1,
          _id: 1,
          votingLength: 1,
          options: 1,
        },
      },
      {
        $lookup: {
          from: "pollpostvotes",
          localField: "_id",
          foreignField: "postId",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", req.user._id],
                },
              },
            },
          ],
          as: "userVotedDetail",
        },
      },
    ]);
    if (!postInfo.length) {
      throw {
        message:
          "either of this parameter wrongly passed (postType,postId,option)",
      };
    }
    let currentDate = moment().utc().format("DD/MM/YYYY"),
      closingDate = moment(postInfo[0].publishedOn)
        .utc()
        .add(postInfo[0].votingLength, "days")
        .format("DD/MM/YYYY");
    if (currentDate >= closingDate) {
      throw { message: "voting period is closed" };
    }
    let customeError = "Vote cast successful";
    if (!postInfo[0].userVotedDetail?.length) {
      await insertPollVote({
        userId: req.user._id,
        postId: postId,
        choosenOption: option,
      });
    } else if (postInfo[0].userVotedDetail[0].choosenOption === option) {
      customeError = "Your vote was removed";
      await deleteVoteById(postInfo[0].userVotedDetail[0]._id);
    } else {
      const setData = {
        userId: req.user._id,
        postId: postId,
        choosenOption: option,
      };
      await updateVoteById(postInfo[0].userVotedDetail[0]._id, setData);
    }
    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.SUCCESS,
      customeError,
      "",
      true
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.ERROR,
      responseTypes.INTERNAL_SERVER_ERROR,
      error?.message || "Something went wrong",
      error,
      true
    );
  }
};

export {
  createPost,
  searchPostMetaLabel,
  addPostMetaLabel,
  addNewReaction,
  addNewComment,
  getPostComments,
  getPost,
  getAllPosts,
  addNewView,
  updatePost,
  addPrivatePostRequest,
  getUserRequests,
  bulkUpdateRequests,
  followPost,
  updatePostByUser,
  pollVote,
};
