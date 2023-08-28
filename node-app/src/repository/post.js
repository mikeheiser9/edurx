import { categoryTagModal } from "../model/post/categoryTag.js";
import { commentModal } from "../model/post/comment.js";
import { postModal } from "../model/post/post.js";
import { reactionModal } from "../model/post/reaction.js";
import { viewModal } from "../model/post/views.js";
import { findAndPaginate } from "../util/commonFunctions.js";
import mongoose from "mongoose";

const createNewPost = async (payload) => {
  console.log(payload);
  const isExist = await postModal.findOne({
    title: payload.title,
    forumType: payload.forumType,
  });
  if (isExist)
    throw new Error(
      `post with name \"${payload.title}\" already exists in forum \"${payload.forumType}\"`
    );
  return await postModal.create(payload);
};

const findPostsByUserId = async (userId, page, limit) => {
  const query = { userId };
  const options = {
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

const searchCategoryTagByName = async (name, type, page, limit) => {
  const query = {
    $and: [
      { name: { $regex: name, $options: "i" } },
      { isDeleted: { $ne: true } },
      { type },
    ],
  };

  return await findAndPaginate(
    categoryTagModal,
    query,
    page && Number(page),
    limit && Number(limit)
  );
};

const addCategoryTag = async (payload) => {
  const isExist = await categoryTagModal.findOne(payload);
  if (isExist)
    throw new Error(`${payload.name} already exists in ${payload.type}`);
  return await categoryTagModal.create(payload);
};

const validateObjectIds = async (objectIds) => {
  return await categoryTagModal.count({
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
}) => {
  try {
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
  // const query = { postId },
  //   options = {
  //     populate: [
  //       {
  //         path: "taggedUsers",
  //         select: ["first_name"],
  //       },
  //       {
  //         path: "views",
  //       },
  //     ],
  //   };
  // return await findAndPaginate(
  //   commentModal,
  //   query,
  //   page && Number(page),
  //   limit && Number(limit),
  //   options
  // );

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
                // pipeline: [
                //   {
                //     $match: {
                //       reactionType: "like",
                //     },
                //   },
                // ],
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
                      last_name: 1,
                      role: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "repliedTo",
                foreignField: "_id",
                as: "repliedTo",
                pipeline: [
                  {
                    $project: {
                      email: 1,
                      first_name: 1,
                      last_name: 1,
                      role: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: "$repliedTo",
            },
            {
              $addFields: {
                // views: { $size: "$views" },
                likeCount: { $size: "$likeCount" },
                dislikeCount: { $size: "$dislikeCount" },
              },
            },
            {
              $sort: { createdAt: -1 },
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
          from: "reactions",
          localField: "_id",
          foreignField: "commentId",
          as: "reactions",
          // pipeline: [
          //   {
          //     $match: {
          //       reactionType: "like",
          //     },
          //   },
          // ],
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
        $sort: { createdAt: -1 },
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
    console.log(result);

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
    select: ["profile_img", "email", "first_name", "last_name", "role"],
  };
  return await postModal.findById({ _id: postId }).populate([
    "commentCount",
    "likeCount",
    "dislikeCount",
    "views",
    userPopulator,
    {
      path: "tags",
      select: ["name"],
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
          createdAt: -1,
        },
      },
      match: {
        parentId: null,
      },
      populate: [
        userPopulator,
        {
          path: "reactions",
          select: ["reactionType", "targetType", "userId"],
          match: { userId },
        },
        {
          path: "replies",
          populate: [
            userPopulator,
            // "views",
            "likeCount",
            "dislikeCount",
            {
              path: "repliedTo",
              select: ["email", "first_name", "last_name", "role"],
            },
            {
              path: "reactions",
              select: ["reactionType", "targetType", "userId"],
              match: { userId },
            },
          ],
          options: {
            sort: {
              createdAt: -1,
            },
          },
        },
        // "views",
        "likeCount",
        "dislikeCount",
      ],
    },
  ]);
};

const getPosts = async ({
  page = 1,
  limit = 10,
  sortBy,
  forumType,
  categories,
  userId,
}) => {
  try {
    console.log(userId);
    const skippedPages = (page - 1) * limit;
    const sortByQuery = {
      newest: { createdAt: -1 },
      trending: { views: -1 }, // Sort by the number of views in descending order
      popular: { likes: -1 }, // Sort by the number of likes in descending order
    };
    const query = {
      ...(forumType ? { forumType } : {}),
      ...(categories ? { categories: { $in: categories } } : {}),
      ...(userId ? { userId } : {}),
    };

    console.log("query", query);

    const pipeline = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "postcategorytags",
          localField: "categories",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $lookup: {
          from: "postcategorytags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
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
              $lookup: {
                from: "userconnections",
                localField: "_id",
                foreignField: "targetUserId",
                as: "followings",
                pipeline: [
                  {
                    $project: {
                      userId: 1,
                      targetUserId: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                followings: "$followings",
              },
            },
            {
              $project: {
                email: 1,
                role: 1,
                followings: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" },
      {
        $lookup: {
          from: "views",
          localField: "_id",
          foreignField: "itemId",
          as: "views",
        },
      },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "postId",
          as: "reactions",
          pipeline: [
            {
              $match: {
                reactionType: "like",
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
          pipeline: [
            {
              $match: {
                isDeleted: false,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          views: { $size: "$views" },
          likes: { $size: "$reactions" },
          comments: { $size: "$comments" },
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
    console.log(JSON.stringify(operations));

    if (operations.length === 0) {
      return null; // Return null when all views already exist
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

export {
  createNewPost,
  findPostsByUserId,
  searchCategoryTagByName,
  addCategoryTag,
  validateObjectIds,
  addReaction,
  addComment,
  getCommentsByPostId,
  getPostById,
  getPosts,
  addViews,
};
