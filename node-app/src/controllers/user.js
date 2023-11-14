import { insertNotification } from "../repository/notification.js";
import {
  addRemoveConnections,
  getBasicProfile,
  getUserProfileById,
  updateProfileById,
  addNewDocument,
  getUsersDocs,
  searchUsersByName,
  getUserConnections,
  addUpdateAccountSettings,
  getAccountSettingById,
} from "../repository/user.js";
import {
  generalResponse,
  getKeyValueFromFiles,
} from "../util/commonFunctions.js";
import { responseCodes, responseTypes } from "../util/constant.js";

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAuthCheck, usePopulate } = req.query;
    if (isAuthCheck === "true" || isAuthCheck === true) {
      // fething basic information for auth check only
      const basicDetails = await getBasicProfile(userId);
      if (!basicDetails)
        return generalResponse(res, 400, "error", "user not found", null, true);
      return generalResponse(
        res,
        200,
        "OK",
        "authenticated",
        { user: basicDetails },
        false
      );
    }
    const loggedInUserId = req.user._id?.toString();
    console.log({ loggedInUserId });
    const user = await getUserProfileById(
      userId,
      {
        atrributes: [
          "password",
          "__v",
          "verification_code_expiry_time",
          "verification_code",
          "verified_account",
        ],
      },
      usePopulate === "true",
      userId !== loggedInUserId && loggedInUserId
    );
    if (user) {
      return generalResponse(res, 200, "success", null, { user }, false);
    } else {
      return generalResponse(res, 400, "error", "user not found", null, true);
    }
  } catch (error) {
    return generalResponse(
      res,
      400,
      "error",
      "oops...,error in fetching profile",
      null,
      true
    );
  }
};

const updateUserByID = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body) throw new Error("Request body is required");
    const { userId } = req.body;
    const user = await updateProfileById(userId, {
      ...req.body,
      ...getKeyValueFromFiles(req.files),
    });
    if (!user) throw new Error("Could not update profile with id");
    return generalResponse(res, 200, "success", null, { user }, false);
  } catch (error) {
    console.log(error);
    return generalResponse(
      res,
      400,
      "error",
      "oops... Something went wrong",
      null,
      true
    );
  }
};

const addUpdateDocument = async (req, res, next) => {
  try {
    if (!req.body) throw new Error("Request body is required");
    const doc = await addNewDocument({
      ...req.body,
      ...getKeyValueFromFiles(req.files),
    });
    return generalResponse(
      res,
      200,
      "OK",
      "Document added successfully",
      doc,
      true
    );
  } catch (error) {
    console.log(error);
    return generalResponse(
      res,
      400,
      "error",
      "oops... Something went wrong",
      null,
      true
    );
  }
};

const getUsersDocuments = async (req, res) => {
  try {
    const query = {
      ...req.query,
      ...req.params,
    };
    const docs = await getUsersDocs(query);
    return generalResponse(
      res,
      200,
      "success",
      "User documents fetched successfully",
      docs,
      false
    );
  } catch (error) {
    console.log(error);
    return generalResponse(
      res,
      400,
      "error",
      "Something went wrong",
      error,
      true
    );
  }
};

const postConnections = async (req, res) => {
  try {
    const response = await addRemoveConnections({
      ...req.body,
      action: req.params.action,
    });
    let message = typeof response === "string" ? response : null;
    if (req.params.action == "add") {
      const isExist = await getBasicProfile(req.body?.targetUserId);
      if (!isExist) {
        throw new Error("target user not exists...!");
      }
      const eventTime = new Date();
      await insertNotification({
        type: "user_followed_you",
        sourceId: req.user._id,
        destinationId: req.body?.targetUserId,
        eventTime,
      });
    }
    return generalResponse(
      res,
      200,
      "OK",
      message
        ? message
        : `Connection ${
            req.params.action === "add" ? "added" : "removed"
          } successfully`,
      !message ? response : null,
      false
    );
  } catch (err) {
    console.log(err);
    return generalResponse(
      res,
      400,
      "error",
      "Something went wrong",
      err,
      true
    );
  }
};

const getConnections = async (req, res) => {
  try {
    const { type, userId } = req.params;
    const { page, limit } = req.query;
    const response = await getUserConnections(userId, type, page, limit);
    generalResponse(
      res,
      200,
      "success",
      `${type} fetched successfully`,
      response
    );
  } catch (error) {
    console.log(error);
    generalResponse(res, 400, "error", "Something went wrong", error);
  }
};

const searchUsers = async (req, res) => {
  try {
    console.log(req.query);
    const { searchKeyword, page, limit } = req.query;
    const response = await searchUsersByName(searchKeyword, page, limit);
    return generalResponse(
      res,
      200,
      "OK",
      "Users fetched successfully",
      response,
      false
    );
  } catch (error) {
    return generalResponse(res, 400, "error", "Something went wrong", error);
  }
};

const createAccountSettings = async (req, res) => {
  try {
    const payload = {
      userId: req.user._id,
      ...req.body,
    };
    const response = await addUpdateAccountSettings(payload);
    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.OK,
      "account settings created / updated successfully",
      response,
      true
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.ERROR,
      responseTypes.ERROR,
      "Something went wrong",
      error,
      true
    );
  }
};

const getAccountSettings = async (req, res) => {
  try {
    const response = await getAccountSettingById(req.user._id);
    return generalResponse(
      res,
      responseCodes.SUCCESS,
      responseTypes.OK,
      "account settings fetched",
      response
    );
  } catch (error) {
    return generalResponse(
      res,
      responseCodes.ERROR,
      responseTypes.ERROR,
      "Something went wrong",
      error
    );
  }
};

export {
  getUserProfile,
  updateUserByID,
  addUpdateDocument,
  getUsersDocuments,
  postConnections,
  searchUsers,
  getConnections,
  createAccountSettings,
  getAccountSettings,
};
