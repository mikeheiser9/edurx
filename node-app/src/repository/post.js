import { Types } from "mongoose";
import { categoryTagModal } from "../model/post/categoryTag.js";
import { commentModal } from "../model/post/comment.js";
import { postModal } from "../model/post/post.js";
import { reactionModal } from "../model/post/reaction.js";
import { viewModal } from "../model/post/views.js";
import { findAndPaginate } from "../util/commonFunctions.js";

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
        $or: [{ postId }, { commentId }],
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
      { upsert: true }
    );

    // If the reaction already existed and it's different from the new one
    if (updatedReaction && updatedReaction.reactionType !== reactionType) {
      return {
        data: updatedReaction,
        message: `${targetType} reaction successfully updated to ${reactionType}`,
      };
    }

    // Otherwise, it's a new reaction or the reaction is the same as the existing one
    return {
      data: updatedReaction,
      message: `${targetType} reaction added successfully`,
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

const getCommentsByPostId = async (postId, page, limit) => {
  const query = { postId },
    options = {
      populate: [
        {
          path: "taggedUsers",
          select: ["first_name"],
        },
        {
          path: "views",
        },
      ],
    };
  return await findAndPaginate(
    commentModal,
    query,
    page && Number(page),
    limit && Number(limit),
    options
  );
};

const getPostById = async (postId) => {
  return await postModal.findById({ _id: postId }).populate([
    "comments",
    // "reactions",
    "commentCount",
    // "likeCount",
    // "dislikeCount",
    "views",
  ]);
};

// const getPosts = async (payload) => {
//   console.log(payload);
//   const { page, limit, sortBy, forumType } = payload;
//   const soryByQuery = {
//     newest: { createdAt: -1 },
//     popular: { views: -1 },
//     trending: "",
//   };
//   const query = forumType ? { forumType } : {},
//     options = {
//       populate: ["views", "likeCount"],
//       ...(sortBy ? { sort: soryByQuery[sortBy] } : {}),
//     };
//   return await postModal
//     .find(query)
//     .populate(["views", "likeCount"])
//     .sort({ views: -1 });
//   // return await findAndPaginate(
//   //   postModal,
//   //   query,
//   //   page && Number(page),
//   //   limit && Number(limit),
//   //   options
//   // );
// };

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
          // likes: {
          //   $sum: {
          //     $cond: [{ $eq: ["$reactions.reactionType", "like"] }, 1, 0],
          //   },
          // },
        },
      },
      {
        $project: {
          reactions: 0,
        },
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
        t: this,
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
