import {
  getBasicProfile,
  getUserProfileById,
  updateProfileById,
} from "../repository/user.js";
import {
  addNewDocument,
  getUsersDocs,
} from "../repository/userDocument.js";
import {
  generalResponse,
  getKeyValueFromFiles,
} from "../util/commonFunctions.js";

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
      usePopulate === "true"
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

export { getUserProfile, updateUserByID, addUpdateDocument, getUsersDocuments };
