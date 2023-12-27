import { Router } from "express";
import { checkIsSuperAdmin, signInFieldValidator, updateUserByAdminValidator } from "../middleware/validator/auth.js";
import { adminLogin, deleteUserByAdmin, fetchUsersByAdmin, updateUserByAdmin } from "../controllers/admin.js";
import { userAuth } from "../middleware/passport/userAuth.js";

const adminRoutes = Router();
adminRoutes.post("/login",signInFieldValidator,adminLogin)
// USERS
adminRoutes.get("/users",userAuth,checkIsSuperAdmin,fetchUsersByAdmin);
adminRoutes.delete("/user",userAuth,checkIsSuperAdmin,deleteUserByAdmin);
adminRoutes.put("/user",userAuth, checkIsSuperAdmin,updateUserByAdminValidator,updateUserByAdmin);

export default adminRoutes;
