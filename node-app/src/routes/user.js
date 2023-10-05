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
} from "../controllers/user.js";
import {
  addDocumentValidator,
  userConnectionsValidator,
  getUserDocumentsValidator,
  getUserProfileValidator,
  updateUserValidator,
  getConnectionsValidator,
  searchUsersValidator,
} from "../middleware/validator/user.js";

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

export default userRoute;
