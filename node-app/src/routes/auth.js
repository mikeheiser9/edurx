import { Router } from "express";
import {
  signInFieldValidator,
  signUpFieldValidator,
  sendVerificationCodeFieldValidator,
  verifyCodeFieldValidator,
  npiLookupValidator,
} from "../middleware/validator/auth.js";
import {
  sendVerificationCode,
  signUp,
  verifyCode,
  signIn,
  npiLookup,
} from "../controllers/auth.js";

const authRoute = Router();

authRoute.post("/sign_up", signUpFieldValidator, signUp);
authRoute.post("/sign_in", signInFieldValidator, signIn);
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

export default authRoute;
