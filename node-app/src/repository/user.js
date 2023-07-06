import { userModel } from "../model/user.js";
import { getSkippedAttributes } from "../util/commonFunctions.js";

const userExistWithEmail = async (email) => {
  const user = await userModel.findByEmail(email);
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
    let education_filter = usePopulate && {
      educations: {
        $slice: 2,
      },
    };
    let skippedAttributes = getSkippedAttributes(excludeAttributeList);
    const userProfileQuery = userModel.findById({ _id: userId }).select({
      ...skippedAttributes,
      ...education_filter,
    });

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
        },
        {
          path: "userDocuments",
          match: {
            doc_type: { $in: ["license", "certificate"] },
          },
          options: {
            sort: {
              createdAt: -1,
            },
          },
          perDocumentLimit: 4,
        },
      ]);
    }

    const userProfile = await userProfileQuery.exec();

    if (!userProfile) return null;

    let result = { ...userProfile.toJSON() };

    if (usePopulate) {
      const licenses = userProfile.userDocuments
        .filter((doc) => doc.doc_type === "license")
        .slice(0, 2);
      const certificates = userProfile.userDocuments
        .filter((doc) => doc.doc_type === "certificate")
        .slice(0, 2);

      result = {
        ...result,
        posts: userProfile.userPosts,
        licenses,
        certificates,
      };
    }

    return result;
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

export {
  getUserProfileById,
  findUserByEmail,
  storeUserRegistrationInfoInDb,
  updateUser,
  userExistWithEmail,
  updateProfileById,
  getBasicProfile,
};
