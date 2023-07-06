import { Router } from "express";
import { userAuth } from "../middleware/passport/userAuth.js";
import {
  addUpdateDocument,
  getUserProfile,
  getUsersDocuments,
  updateUserByID,
} from "../controllers/user.js";
import {
  addDocumentValidator,
  getUserDocumentsValidator,
  getUserProfileValidator,
  updateUserValidator,
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

userRoute.get("/:userId/documents", userAuth, getUserDocumentsValidator, getUsersDocuments);

export default userRoute;
