import { Router } from "express";
import { checkIsSuperAdmin, signInFieldValidator, updateUserByAdminValidator } from "../middleware/validator/auth.js";
import { adminLogin, deleteResourceById, deleteUserByAdmin, fetchCategoryByAdmin, fetchUsersByAdmin, insertResource, updateResourceById, updateUserByAdmin } from "../controllers/admin.js";
import { userAuth } from "../middleware/passport/userAuth.js";
import { getResources } from "../controllers/resource.js";
import { addResourceValidator } from "../middleware/validator/resource.js";

const adminRoutes = Router();
adminRoutes.post("/login",signInFieldValidator,adminLogin)
// USERS
adminRoutes.get("/users",userAuth,checkIsSuperAdmin,fetchUsersByAdmin);
adminRoutes.delete("/user",userAuth,checkIsSuperAdmin,deleteUserByAdmin);
adminRoutes.put("/user",userAuth, checkIsSuperAdmin,updateUserByAdminValidator,updateUserByAdmin);

// RESOURCES
adminRoutes.get('/resource/resources',userAuth, getResources);
adminRoutes.get("/resource/category",userAuth,checkIsSuperAdmin,fetchCategoryByAdmin);
adminRoutes.delete('/resource', userAuth,checkIsSuperAdmin,deleteResourceById);
adminRoutes.put('/resource', userAuth,checkIsSuperAdmin,addResourceValidator,updateResourceById);
adminRoutes.post('/resource', userAuth,checkIsSuperAdmin,addResourceValidator,insertResource);

export default adminRoutes;
