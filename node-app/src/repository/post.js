import { categoryFilterModal } from "../model/post/categoryTag.js";
import { commentModal } from "../model/post/comment.js";
import { pollPostVoteModal } from "../model/post/pollPostVote.js";
import { postModal } from "../model/post/post.js";
import { postRequestModal } from "../model/post/postAccessRequest.js";
import { reactionModal } from "../model/post/reaction.js";
import { viewModal } from "../model/post/views.js";
import {
  findAndPaginate,
  getAllowedForumAccessBasedOnRoleAndNpiDesignation,
} from "../util/commonFunctions.js";
import mongoose from "mongoose";

const createNewPost = async (payload) => {
  const isExist = await postModal.findOne({
    title: payload.title,
    forumType: payload.forumType,
    isDeleted: { $ne: true },
  });
  if (isExist)
    throw new Error(
      `post with name \"${payload.title}\" already exists in forum \"${payload.forumType}\"`
    );
  return await postModal.create(payload);
};

const findPostsByUserId = async (userId, page, limit) => {
  const query = { userId, isDeleted: { $ne: true } },
    options = {
      populate: [{ path: "categories" }],
      sort: {
        createdAt: 1,
      },
      // other options
    };

  return await findAndPaginate(
    postModal,
    query,
    page && Number(page),
    limit && Number(limit),
    options
  );
};

const searchCategoryFilterByName = async (
  name,
  type,
  page,
  limit,
  forumType
) => {
  const query = {
    $and: [
      { name: { $regex: name, $options: "i" } },
      { isDeleted: { $ne: true } },
      { type },
      { forumType: { $in: forumType } },
    ],
  };

  return await findAndPaginate(
    categoryFilterModal,
    query,
    page && Number(page),
    limit && Number(limit)
  );
};

const addCategoryFilter = async (payload) => {
  return await categoryFilterModal.create(payload);
};

const updateCategoryFilterById = async (id, payload)=>{
  return await categoryFilterModal.findByIdAndUpdate(id,payload);
}

const validateObjectIds = async (objectIds) => {
  return await categoryFilterModal.count({
    _id: {
      $in: objectIds,
    },
  });
};

const addReaction = async ({
  userId,
  postId,
  commentId,
  targetType,
  reactionType,
  _id,
}) => {
  try {
    // if payload has _id and reactionType is null then reaction already exists delete reaction
    if (_id && reactionType == null) {
      const deletedReaction = await reactionModal.findByIdAndDelete(_id);
      return {
        data: deletedReaction,
        message: `${targetType} reaction successfully removed`,
      };
    }
    const updatedReaction = await reactionModal.findOneAndUpdate(
      {
        userId,
        targetType,
        postId,
        commentId,
      },
      {
        $set: {
          userId,
          postId,
          commentId,
          targetType,
          reactionType,
        },
      },
      { upsert: true, new: true }
    );

    return {
      data: updatedReaction,
      message: `${targetType} reaction successfully updated to ${reactionType}`,
    };
  } catch (err) {
    throw new Error(
      `Failed to perform user reaction operation: ${err.message}`
    );
  }
};

const addComment = async (payload) => {
  return await commentModal.create(payload);
};

const getCommentsByPostId = async (postId, page = 1, limit = 10, userId) => {
  try {
    const skippedPages = (page - 1) * limit;
    const pipeline = [
      {
        $match: { postId: new mongoose.Types.ObjectId(postId), parentId: null }, // Match top-level comments
      },
      {
        $lookup: {
          from: "comments", // Collection name
          localField: "_id",
          foreignField: "parentId",
          as: "replies",
          pipeline: [
            // {
            //   $lookup: {
            //     from: "views",
            //     localField: "_id",
            //     foreignField: "itemId",
            //     as: "views",
            //   },
            // },
            {
              $lookup: {
                from: "reactions",
                localField: "_id",
                foreignField: "commentId",
                as: "reactions",
              },
            },
            {
              $addFields: {
                replies: "$replies",
                likeCount: {
                  $size: {
                    $filter: {
                      input: "$reactions",
                      as: "item",
                      cond: { $eq: ["$$item.reactionType", "like"] },
                    },
                  },
                },
                dislikeCount: {
                  $size: {
                    $filter: {
                      input: "$reactions",
                      as: "item",
                      cond: { $eq: ["$$item.reactionType", "dislike"] },
                    },
                  },
                },
                reactions: {
                  $filter: {
                    input: "$reactions",
                    as: "item",
                    cond: { $eq: ["$$item.userId", userId] },
                  },
                }, // logged in user's reaction
                // views: { $size: "$views" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userId",
                pipeline: [
                  {
                    $project: {
                      profile_img: 1,
                      email: 1,
                      first_name: 1,
                      username: 1,
                      last_name: 1,
                      role: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: "$userId",
            },
            {
              $lookup: {
                from: "users",
                localField: "taggedUsers",
                foreignField: "_id",
                as: "taggedUsers",
                pipeline: [
                  {
                    $project: {
                      email: 1,
                      first_name: 1,
                      last_name: 1,
                      username: 1,
                      role: 1,
                      profile_img: 1,
                    },
                  },
                ],
              },
            },
            {
              $sort: { createdAt: 1 },
            },
          ],
        },
      },
      // {
      //   $lookup: {
      //     from: "views",
      //     localField: "_id",
      //     foreignField: "itemId",
      //     as: "views",
      //   },
      // },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            {
              $project: {
                profile_img: 1,
                email: 1,
                first_name: 1,
                last_name: 1,
                username: 1,
                role: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$userId",
      },
      {
        $lookup: {
          from: "users",
          localField: "taggedUsers",
          foreignField: "_id",
          as: "taggedUsers",
          pipeline: [
            {
              $project: {
                email: 1,
                first_name: 1,
                last_name: 1,
                username: 1,
                role: 1,
                profile_img: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "commentId",
          as: "reactions",
        },
      },
      {
        $addFields: {
          replies: "$replies",
          likeCount: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "item",
                cond: { $eq: ["$$item.reactionType", "like"] },
              },
            },
          },
          dislikeCount: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "item",
                cond: { $eq: ["$$item.reactionType", "dislike"] },
              },
            },
          },
          reactions: {
            $filter: {
              input: "$reactions",
              as: "item",
              cond: { $eq: ["$$item.userId", userId] },
            },
          }, // logged in user's reaction
          // views: { $size: "$views" },
        },
      },
      // { $unwind: "$reactions" },
      {
        $sort: { createdAt: 1 },
      },
      {
        $facet: {
          records: [{ $skip: skippedPages }, { $limit: limit }],
          metadata: [{ $count: "totalCount" }],
        },
      },
    ];

    const result = await commentModal.aggregate(pipeline);
    const totalCount = result?.[0]?.metadata[0]?.totalCount || 0;

    return {
      comments: {
        metadata: {
          totalRecords: totalCount,
          currentPage: Number(page),
          limit,
          pageCount: totalCount < limit ? 1 : Math.ceil(totalCount / limit),
        },
        data: result[0].records,
      },
    };
  } catch (error) {
    console.error("Error fetching comments with replies:", error);
    throw error;
  }
};

const getPostById = async (postId, userId) => {
  let userPopulator = {
      path: "userId",
      select: [
        "profile_img",
        "email",
        "first_name",
        "username",
        "last_name",
        "role",
      ],
    },
    taggedUsers = {
      path: "taggedUsers",
      select: [
        "email",
        "first_name",
        "last_name",
        "username",
        "role",
        "profile_img",
      ],
    };
  return await postModal
    .findOne({ _id: postId, isDeleted: { $ne: true } })
    .populate([
      "commentCount",
      "likeCount",
      "dislikeCount",
      "views",
      "userAccessRequestCount",
      userPopulator,
      {
        path: "filters",
        select: ["name"],
      },
      {
        path: "userAccessRequests",
        match: { userId },
      },
      {
        path: "userPostFollowers",
        match: { userId },
      },
      {
        path: "reactions",
        select: ["reactionType", "targetType", "userId"],
        match: { userId },
      },
      {
        path: "categories",
        select: ["name"],
      },
      {
        path: "comments",
        limit: 10,
        options: {
          sort: {
            createdAt: 1,
          },
        },
        match: {
          parentId: null,
        },
        populate: [
          userPopulator,
          taggedUsers,
          {
            path: "reactions",
            select: ["reactionType", "targetType", "userId"],
            match: { userId },
          },
          {
            path: "replies",
            populate: [
              userPopulator,
              taggedUsers,
              // "views",
              "likeCount",
              "dislikeCount",
              {
                path: "reactions",
                select: ["reactionType", "targetType", "userId"],
                match: { userId },
              },
            ],
            options: {
              sort: {
                createdAt: 1,
              },
            },
          },
          // "views",
          "likeCount",
          "dislikeCount",
        ],
      },
      {
        path: "votingInfo",
        select: ["userId", "choosenOption"],
      },
    ]);
};

const getPosts = async ({
  page = 1, // TODO: this should
  limit = 10,
  sortBy,
  forumType,
  categories,
  userId,
  loggedInUser,
  filters,
  role,
  npi_designation,
  postStatus,
}) => {
  try {
    let forum = [];
    if (!forumType || forumType === "All Forums") {
      forum = getAllowedForumAccessBasedOnRoleAndNpiDesignation(
        role,
        npi_designation
      );
    }
    const skippedPages = (page - 1) * limit;
    const sortByQuery = {
      newest: { createdAt: -1 },
      trending: { views: -1 }, // Sort by the number of views in descending order
      popular: { likes: -1 }, // Sort by the number of likes in descending order
    };

    const query = {
      ...(userId ? { userId } : {}),
      ...(forumType && forumType !== "All Forums"
        ? { forumType }
        : { forumType: { $in: forum } }),
      ...(categories ? { categories: { $in: categories } } : {}),
      ...(filters ? { filters: { $in: filters } } : {}),
      isDeleted: { $ne: true },
      postStatus,
    };
    const pipeline = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "postcategoryfilters",
          localField: "categories",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $lookup: {
          from: "postcategoryfilters",
          localField: "filters",
          foreignField: "_id",
          as: "filters",
        },
      },
      {
        $lookup: {
          from: "views",
          localField: "_id",
          foreignField: "itemId",
          as: "views",
        },
      },
      // {
      //   $lookup: {
      //     from: "comments",
      //     let:{id:"$_id"},
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr:{$eq: ["$postId","$$id"]},
      //           'id.isDeleted':false
      //         },
      //       },
      //     ],
      //     as:"comments",
      //   },
      // }
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
          // pipeline: [
          //   {
          //     $match: {
          //       isDeleted: false,
          //     },
          //   },
          // ],
        },
      },
      {
        // join postrequest collection to check what is status of private post request
        $lookup: {
          from: "postrequests",
          let: { postIdentifier: "$_id" },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: { $eq: ["$postId", "$$postIdentifier"] },
                  },
                  {
                    userId: loggedInUser,
                  },
                ],
              },
            },
            {
              $project: {
                userId: 1,
                postId: 1,
                status: 1,
              },
            },
          ],
          as: "postRequests",
        },
      },
      {
        $lookup: {
          // join userconnections to check logged user follows which post
          from: "userconnections",
          let: { postIdentifier: "$_id" },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: { $eq: ["$postId", "$$postIdentifier"] },
                  },
                  {
                    userId: loggedInUser,
                  },
                ],
              },
            },
            {
              $project: {
                userId: 1,
                postId: 1,
              },
            },
          ],
          as: "userPostFollowList",
        },
      },
      {
        $addFields: {
          views: { $size: "$views" },
          commentCount: { $size: "$comments" },
          categories: "$categoryData",
        },
      },
      {
        $unset: ["categoryData", "reactions"], // Remove the temporary fields
      },
      {
        $sort: sortBy ? sortByQuery[sortBy] : { createdAt: 1 },
      },
      {
        $facet: {
          records: [{ $skip: skippedPages }, { $limit: limit }],
          metadata: [{ $count: "totalCount" }],
        },
      },
    ];

    const posts = await postModal.aggregate(pipeline);
    const totalCount = posts?.[0]?.metadata[0]?.totalCount || 0;

    return {
      posts: {
        metadata: {
          totalRecords: totalCount,
          currentPage: Number(page),
          limit,
          pageCount: totalCount < limit ? 1 : Math.ceil(totalCount / limit),
        },
        data: posts[0].records,
      },
    };
  } catch (error) {
    console.error("Error occurred during get all post:", error);
    return error;
  }
};

const addViews = async (payload) => {
  if (Array.isArray(payload.itemId)) {
    const operations = payload.itemId.map((objectId) => ({
      updateOne: {
        filter: {
          userId: payload.userId,
          itemId: objectId,
          itemType: payload.itemType,
        },
        update: {
          $setOnInsert: { ...payload, itemId: objectId },
        },
        upsert: true,
      },
    }));

    if (operations.length === 0) {
      return null;
    }

    try {
      const result = await viewModal.bulkWrite(operations);
      return { data: result, message: "views added successfully" };
    } catch (error) {
      return {
        data: null,
        message: error.message,
      };
    }
  } else {
    try {
      const result = await viewModal.replaceOne(payload, payload, {
        upsert: true,
      });
      return { data: result, message: "view added successfully" };
    } catch (error) {
      return {
        data: null,
        message: error.message,
      };
    }
  }
};

const updatePostById = async (payload) => {
  try {
    const postId = payload?._id;
    if (!postId) throw new Error("Post id is required");
    return await postModal.findByIdAndUpdate(postId, payload);
  } catch (error) {
    return error;
  }
};

const addPostAccessRequest = async ({ postId, userId, status }) => {
  try {
    const filter = { postId, userId },
      update = {
        $set: {
          postId,
          userId,
          status,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await postRequestModal.findOneAndUpdate(filter, update, options);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getRequestsByPostId = async (postId, page, limit) => {
  try {
    const query = { postId },
      options = {
        populate: {
          path: "userId",
          select: ["first_name", "last_name", "username", "profile_img"],
        },
        sort: {
          createdAt: -1,
        },
      };
    return await findAndPaginate(
      postRequestModal,
      query,
      page && Number(page),
      limit && Number(limit),
      options
    );
    // return await postRequestModal.find().populate({
    //   path: "userId",
    //   select: ["first_name", "last_name", "username", "profile_img"],
    // });
  } catch (error) {
    return error;
  }
};

const updatePostRequests = async (requestsToUpdate) => {
  try {
    const bulkOperations = requestsToUpdate.map((request) => ({
      updateOne: {
        filter: { _id: request._id },
        update: { $set: { status: request.status } },
      },
    }));

    return await postRequestModal.bulkWrite(bulkOperations);
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};

const findPostById = async (postId) => {
  return await postModal.findById(postId);
};

const deletePostRequest = async (condition) => {
  return await postRequestModal.deleteMany(condition);
};

const fetchFilters = async () => {
  return await categoryFilterModal.find(
    { type: "filter" },
    {
      name: 1,
      type: 1,
      _id: 1,
    }
  );
};

const deleteOnePostRequest = async (condition) => {
  return await postRequestModal.deleteOne(condition);
};

const findCategoryOrPostByCondition = (payload) => {
  return categoryFilterModal.findOne(payload);
};

const findDraftsByUserId = (userId, skip, limit) => {
  return postModal
    .find({
      userId: userId,
      isDeleted: false,
      postStatus: "draft",
    })
    .populate("categories", "name _id")
    .populate("filters", "name _id")
    .sort({ publishedOn: -1 })
    .skip(skip)
    .limit(limit);
};

const updatePostByCondition = (condition, setData) => {
  return postModal.updateOne(condition, setData);
};

export {
  createNewPost,
  findPostsByUserId,
  searchCategoryFilterByName,
  addCategoryFilter,
  validateObjectIds,
  addReaction,
  addComment,
  getCommentsByPostId,
  getPostById,
  getPosts,
  addViews,
  updatePostById,
  addPostAccessRequest,
  getRequestsByPostId,
  updatePostRequests,
  findPostById,
  deletePostRequest,
  fetchFilters,
  deleteOnePostRequest,
  findCategoryOrPostByCondition,
  findDraftsByUserId,
  updatePostByCondition,
  updateCategoryFilterById
};
