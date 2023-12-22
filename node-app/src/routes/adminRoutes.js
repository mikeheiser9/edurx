import { Router } from "express";
import { signInFieldValidator } from "../middleware/validator/auth.js";
import { adminLogin, deleteUserByAdmin, fetchUsersByAdmin } from "../controllers/admin.js";

const adminRoutes = Router();
adminRoutes.post("/login",signInFieldValidator,adminLogin)
// USERS
adminRoutes.get("/users",fetchUsersByAdmin);
adminRoutes.delete("/user",deleteUserByAdmin);


export default adminRoutes;
