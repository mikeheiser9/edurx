import { Router } from "express";
import { userAuth } from "../middleware/passport/userAuth.js";
import {
  postConnections,
  addUpdateDocument,
  getUserProfile,
  getUsersDocuments,
  updateUserByID,
  searchUsers,
  getConnections,
  createAccountSettings,
  getAccountSettings,
  userDrafts,
  userDraftsCount,
  userDraft,
} from "../controllers/user.js";
import {
  addDocumentValidator,
  userConnectionsValidator,
  getUserDocumentsValidator,
  getUserProfileValidator,
  updateUserValidator,
  getConnectionsValidator,
  searchUsersValidator,
  createAccountSettingsValidator,
} from "../middleware/validator/user.js";
import ResourceController from "../controllers/resource.js";
import {
  addResourceValidator,
  validateIds,
} from "../middleware/validator/resource.js";
import { deletePostDraftValidator } from "../middleware/validator/post.js";

const userRoute = Router();
userRoute.get(
  "/:userId/profile",
  userAuth,
  getUserProfileValidator,
  getUserProfile
);
userRoute.put("/profile", userAuth, updateUserValidator, updateUserByID);
userRoute.put(
  "/:userId/documents",
  userAuth,
  addDocumentValidator,
  addUpdateDocument
  // fileUpload,
);

userRoute.get(
  "/:userId/documents",
  userAuth,
  getUserDocumentsValidator,
  getUsersDocuments
);
userRoute.post(
  "/connections/:action",
  userAuth,
  userConnectionsValidator,
  postConnections
);
userRoute.get(
  "/connections/:userId/:type",
  userAuth,
  getConnectionsValidator,
  getConnections
);

userRoute.get("/search", userAuth, searchUsersValidator, searchUsers);
userRoute.post(
  "/account-settings",
  userAuth,
  createAccountSettingsValidator,
  createAccountSettings
);
userRoute.get("/account-settings", userAuth, getAccountSettings);

userRoute.put("/:userId/saveResource", ResourceController.saveResource);
userRoute.delete("/:userId/unsaveResource", ResourceController.unsaveResource);
userRoute.get("/:userId/reading_list", ResourceController.getReadingList);
userRoute.get("/drafts", userAuth, userDrafts);
userRoute.get("/drafts/count", userAuth, userDraftsCount);
userRoute.delete("/draft/:id",userAuth,deletePostDraftValidator,userDraft)
export default userRoute;
