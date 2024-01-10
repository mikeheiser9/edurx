import { Router } from "express";
import {
  signInFieldValidator,
  signUpFieldValidator,
  sendVerificationCodeFieldValidator,
  verifyCodeFieldValidator,
  npiLookupValidator,
  universityLookupValidator,
  userExistsValidator,
} from "../middleware/validator/auth.js";
import {
  sendVerificationCode,
  signUp,
  verifyCode,
  signIn,
  npiLookup,
  universityLookup,
  isUserExists,
  forgotPassword,
  resetPassword
} from "../controllers/auth.js";

const authRoute = Router();

authRoute.post("/sign_up", signUpFieldValidator, signUp);
authRoute.post("/sign_in", signInFieldValidator, signIn);
authRoute.get("/user_exists", userExistsValidator, isUserExists);
authRoute.post(
  "/send_verification_code",
  sendVerificationCodeFieldValidator,
  sendVerificationCode
);
authRoute.post(
  "/verify_verification_code",
  verifyCodeFieldValidator,
  verifyCode
);
authRoute.get("/npi_number_lookup", npiLookupValidator, npiLookup);
authRoute.get(
  "/university_lookup",
  universityLookupValidator,
  universityLookup
);
authRoute.post("/forgot_password", forgotPassword);
authRoute.post("/reset_password", resetPassword);
export default authRoute;
