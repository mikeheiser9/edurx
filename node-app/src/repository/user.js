import mongoose from "mongoose";
import { userConnections } from "../model/user/connections.js";
import { userDocumentModal } from "../model/user/document.js";
import { userModel } from "../model/user/user.js";
import {
  findAndPaginate,
  getSkippedAttributes,
} from "../util/commonFunctions.js";

const userExistWithEmail = async (email, excludeAttributeList = null) => {
  const user = await userModel.findByEmail(email, excludeAttributeList);
  return user ? { user, isExist: true } : { user, isExist: false };
};
const updateUser = async (email, user) => {
  return await userModel.findOneAndUpdate(
    {
      email,
    },
    {
      ...user,
    }
  );
};
const storeUserRegistrationInfoInDb = async (info) => {
  return await new userModel(info).save();
};
const findUserByEmail = async (email, excludeAttributeList = null) => {
  return await userModel.findByEmail(email, excludeAttributeList);
};

const getUserProfileById = async (
  userId,
  excludeAttributeList = {
    type: "exclude",
    attributes: null,
  },
  usePopulate
) => {
  try {
    let skippedAttributes = getSkippedAttributes(excludeAttributeList);
    const userProfileQuery = userModel.findById({ _id: userId }).select({
      ...skippedAttributes,
      "educations.id": 0,
    });
    let docOptions = {
      limit: 10,
      select: {
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    };

    if (usePopulate) {
      userProfileQuery.populate([
        {
          path: "userPosts",
          options: {
            limit: 6,
            sort: {
              createdAt: -1,
            },
          },
          populate: ["views", "commentCount"],
        },
        {
          path: "licenses",
          options: docOptions,
        },
        {
          path: "certificates",
          options: docOptions,
        },
        {
          path: "followersCount",
        },
        {
          path: "followingCount",
        },
        {
          path: "certificatesCount",
        },
        {
          path: "licensesCount",
        },
        // last comments of user
        {
          path: "recentComments",
          // populate: "views",
        },
      ]);
    }

    const userProfile = await userProfileQuery.exec();

    return userProfile || null;
  } catch (err) {
    console.log(err);
    throw Error(err);
  }
};

const updateProfileById = async (userId, user) => {
  return await userModel
    .findByIdAndUpdate(userId, user, {
      new: true,
    })
    .select({
      password: 0,
      __v: 0,
    });
};

const getBasicProfile = async (userId) => {
  return await userModel.findById(
    { _id: userId },
    {
      _id: 1,
      username: 1,
      role: 1,
      email: 1,
      verified_account: 1,
    }
  );
};

// user documents
const addNewDocument = async (payload) => {
  const { _id } = payload;
  return await userDocumentModal
    .findOneAndUpdate(
      { _id: _id ?? new mongoose.Types.ObjectId() },
      { $set: payload },
      { upsert: true, new: true }
    )
    .select({
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
};

const getUsersDocs = async (payload) => {
  const { page, limit, userId, doc_type } = payload;
  const options = {
    select: {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    },
  };
  return findAndPaginate(
    userDocumentModal,
    { userId, doc_type },
    page && Number(page),
    limit && Number(limit),
    options
  );
};

const getDocumentById = async (id) => {
  return await userDocumentModal.findById({ _id: id });
};

// user connections

const addRemoveConnections = async (payload) => {
  const { userId, targetUserId, action } = payload;

  if (action !== "add" && action !== "remove") {
    throw new Error(
      'Invalid action specified. Supported actions: "add", "remove"'
    );
  }

  try {
    if (action === "add") {
      return await followUser(userId, targetUserId);
    } else {
      return await unfollowUser(userId, targetUserId);
    }
  } catch (error) {
    throw new Error(
      `Failed to perform user connection operation: ${error.message}`
    );
  }
};

const followUser = async (userId, targetUserId) => {
  try {
    // Check if the user connection already exists
    const existingConnection = await userConnections.findOne({
      userId,
      targetUserId,
    });

    if (existingConnection) {
      return "You are already following this user.";
    }

    // Create a new user connection
    return await userConnections.create({ userId, targetUserId });
  } catch (error) {
    throw new Error(`Failed to follow the user: ${error.message}`);
  }
};

const unfollowUser = async (userId, targetUserId) => {
  try {
    // Remove the user connection
    const deletedConnection = await userConnections.findOneAndDelete({
      userId,
      targetUserId,
    });

    if (!deletedConnection) {
      return "You are not following this user.";
    }
    return deletedConnection;
  } catch (error) {
    throw new Error(`Failed to unfollow the user: ${error.message}`);
  }
};

const searchUsersByName = async (searchKeyword, page, limit) => {
  try {
    // searching users based on username or concated first_name and last_name
    const query = searchKeyword?.length
      ? {
          $expr: {
            $or: [
              {
                $regexMatch: {
                  input: { $concat: ["$first_name", " ", "$last_name"] },
                  regex: searchKeyword,
                  options: "i",
                },
              },
              {
                $regexMatch: {
                  input: "$username",
                  regex: searchKeyword,
                  options: "i",
                },
              },
            ],
          },
        }
      : {};

    const options = {
      select: {
        first_name: 1,
        last_name: 1,
        username: 1,
        email: 1,
        role: 1,
        profile_img: 1,
      },
    };
    return await findAndPaginate(
      userModel,
      query,
      page && Number(page),
      limit && Number(limit),
      options
    );
  } catch (error) {
    return error.message;
  }
};

export {
  getUserProfileById,
  findUserByEmail,
  storeUserRegistrationInfoInDb,
  updateUser,
  userExistWithEmail,
  updateProfileById,
  getBasicProfile,
  addRemoveConnections,
  addNewDocument,
  getUsersDocs,
  getDocumentById,
  followUser,
  unfollowUser,
  searchUsersByName,
};
