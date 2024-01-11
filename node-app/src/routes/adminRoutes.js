import { Router } from "express";
import {
  checkIsSuperAdmin,
  signInFieldValidator,
  updateUserByAdminValidator,
} from "../middleware/validator/auth.js";
import {
  adminLogin,
  deleteCategoryFilterById,
  deleteResourceById,
  deleteUserByAdmin,
  fetchCategoryAndFilters,
  fetchCategoryByAdmin,
  fetchResourceByAdmin,
  fetchUsersByAdmin,
  insertCategoryFilter,
  insertResource,
  updateCategoryOrFilterById,
  updateResourceById,
  updateUserByAdmin,
} from "../controllers/admin.js";
import { userAuth } from "../middleware/passport/userAuth.js";
import {
  addCategoryFilterValidator,
  addResourceValidator,
} from "../middleware/validator/resource.js";

const adminRoutes = Router();
adminRoutes.post("/login", signInFieldValidator, adminLogin);
// USERS
adminRoutes.get("/users", userAuth, checkIsSuperAdmin, fetchUsersByAdmin);
adminRoutes.delete("/user", userAuth, checkIsSuperAdmin, deleteUserByAdmin);
adminRoutes.put(
  "/user",
  userAuth,
  checkIsSuperAdmin,
  updateUserByAdminValidator,
  updateUserByAdmin
);

// RESOURCES
adminRoutes.get(
  "/resource/resources",
  userAuth,
  checkIsSuperAdmin,
  fetchResourceByAdmin
);
adminRoutes.get(
  "/resource/category",
  userAuth,
  checkIsSuperAdmin,
  fetchCategoryByAdmin
);
adminRoutes.delete(
  "/resource",
  userAuth,
  checkIsSuperAdmin,
  deleteResourceById
);
adminRoutes.put(
  "/resource",
  userAuth,
  checkIsSuperAdmin,
  addResourceValidator,
  updateResourceById
);
adminRoutes.post(
  "/resource",
  userAuth,
  checkIsSuperAdmin,
  addResourceValidator,
  insertResource
);

// CATEGORIES/ FILTERS

adminRoutes.get(
  "/categories",
  userAuth,
  checkIsSuperAdmin,
  fetchCategoryAndFilters
);
adminRoutes.post(
  "/categories",
  userAuth,
  checkIsSuperAdmin,
  addCategoryFilterValidator,
  insertCategoryFilter
);
adminRoutes.delete(
  "/categories",
  userAuth,
  checkIsSuperAdmin,
  deleteCategoryFilterById
);
adminRoutes.put(
  "/categories",
  userAuth,
  checkIsSuperAdmin,
  addCategoryFilterValidator,
  updateCategoryOrFilterById
);

export default adminRoutes;
