import bcrypt from "bcrypt";
import {
  addUpdateAccountSettings,
  findUserByEmail,
  storeUserRegistrationInfoInDb,
  updateUser,
  userExistWithEmail,
} from "../repository/user.js";
import {
  generalResponse,
  prepareVerificationCodeForEmailConfirmation,
  trimFields,
} from "../util/commonFunctions.js";
import sgMail from "@sendgrid/mail";
import {
  NOTIFICATION_TYPES,
  taxonomyCodeToProfessionalMapping,
} from "../util/constant.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const signUp = async (req, res) => {
  try {
    delete req.body.confirm_password;
    req.body = trimFields(req.body);
    const User = await userExistWithEmail(req.body.email);
    if (User.isExist) {
      if (User.user.verified_account) {
        return generalResponse(
          res,
          200,
          "error",
          "you are already registered with us :)",
          null,
          true
        );
      } else {
        return generalResponse(
          res,
          200,
          "error",
          "confirm your email",
          null,
          false
        );
      }
    }
    const hiiMessageActor =
      req.body.role == "student"
        ? req.body.email
        : req.body.first_name + " " + req.body.last_name;
    const { mail, codeExpireTime, randomCode } =
      prepareVerificationCodeForEmailConfirmation(
        hiiMessageActor,
        req.body.email
      );
    if (req.body.role == "professional") {
      req.body.npi_designation = req.body.npi_designation.map(
        (designation) => taxonomyCodeToProfessionalMapping[designation]
      );
    }
    await storeUserRegistrationInfoInDb({
      ...req.body,
      email: req.body.email.toLowerCase(),
      verification_code_expiry_time: codeExpireTime,
      verification_code: randomCode,
    }).then(async (userRes) => {
      if (userRes?._id) {
        await addUpdateAccountSettings({
          userId: userRes?._id,
          allowedTypes: Object.values(NOTIFICATION_TYPES.All),
        });
      }
    });
    if (process.env.ENVIRONMENT == "production") {
      sgMail
        .send(mail)
        .then(async (mailStatus) => {
          if (mailStatus[0].statusCode == 202) {
            return generalResponse(
              res,
              200,
              "success",
              "mail send to your email id, please confirm your email",
              null,
              true
            );
          }
        })
        .catch(() => {
          return generalResponse(
            res,
            400,
            "error",
            "something went wrong with mail ",
            null,
            true
          );
        });
    } else {
      return generalResponse(
        res,
        200,
        "success",
        "during development mail is not sends, so go to the user collection and copy past verification_code field value to verify you account",
        null,
        true
      );
    }
  } catch (error) {
    generalResponse(res, 400, "error", "something went wrong....", null, true);
  }
};
export const signIn = async (req, res) => {
  try {
    req.body = trimFields(req.body);
    let user = await findUserByEmail(req.body.email, {
      type: "include",
      attribute: [
        "first_name",
        "last_name",
        "email",
        "role",
        "npi_designation",
        "joined",
        "verified_account",
        "password",
        "profile_img",
      ],
    });
    if (user) {
      if (!user.verified_account) {
        return generalResponse(
          res,
          400,
          "error",
          "confirm your email",
          null,
          false
        );
      } else {
        const pass = bcrypt.compareSync(req.body.password, user.password);
        if (pass) {
          const jwtPayload = { email: user.email, role: user.role };
          const secret = process.env.JWT_SECRET || "my_jwt_secret";
          const token = jwt.sign(jwtPayload, secret, { expiresIn: "2d" });
          user.password = "";
          return generalResponse(
            res,
            200,
            "success",
            null,
            { token, details: user },
            true
          );
        } else {
          return generalResponse(
            res,
            400,
            "error",
            "incorrect password...!",
            null,
            true
          );
        }
      }
    } else {
      return generalResponse(
        res,
        401,
        "unAuthorized",
        "user is unauthorized",
        null,
        true
      );
    }
  } catch (error) {
    console.log({ error });
    return generalResponse(
      res,
      400,
      "error",
      "something went wrong....",
      null,
      true
    );
  }
};

export const sendVerificationCode = async (req, res) => {
  try {
    req.body = trimFields(req.body);
    const user = await findUserByEmail(req.body.email);
    if (user) {
      if (!user.verified_account) {
        const { mail, codeExpireTime, randomCode } =
          prepareVerificationCodeForEmailConfirmation(
            user.first_name + " " + user.last_name,
            user.email
          );
        if (process.env.ENVIRONMENT == "production") {
          sgMail
            .send(mail)
            .then(async (mailStatus) => {
              if (mailStatus[0].statusCode == 202) {
                user.verification_code = randomCode;
                user.verification_code_expiry_time = codeExpireTime;
                const update = await updateUser(req.body.email, user);
                if (update) {
                  return generalResponse(
                    res,
                    200,
                    "success",
                    "mail send to your email id, please confirm you email",
                    null,
                    false
                  );
                }
                return generalResponse(
                  res,
                  400,
                  "error",
                  "something went wrong..!",
                  null,
                  true
                );
              }
            })
            .catch(() => {
              return generalResponse(
                res,
                400,
                "error",
                "something went wrong with mail functionality....",
                null,
                true
              );
            });
        } else {
          user.verification_code = randomCode;
          user.verification_code_expiry_time = codeExpireTime;
          const update = await updateUser(user.email, user);
          if (update) {
            return generalResponse(
              res,
              200,
              "success",
              "during development mail is not sends, so go to the user collection and copy past verification_code field value in the verify account api to verify you account",
              null,
              true
            );
          }
          return generalResponse(
            res,
            400,
            "error",
            "something went wrong..!.",
            null,
            true
          );
        }
      } else {
        generalResponse(
          res,
          400,
          "error",
          "you are already registered with us :)",
          null,
          true
        );
      }
    } else {
      generalResponse(
        res,
        400,
        "error",
        "first register yourself....",
        null,
        true
      );
    }
  } catch (error) {
    generalResponse(res, 400, "error", "something went wrong....", error, true);
  }
};

export const verifyCode = async (req, res) => {
  try {
    req.body = trimFields(req.body);
    const user = await findUserByEmail(req.body.email, {
      type: "include",
      attribute: [
        "first_name",
        "last_name",
        "email",
        "role",
        "npi_designation",
        "joined",
        "verified_account",
        "password",
        "profile_img",
        "verification_code_expiry_time",
        "verification_code",
      ],
    });
    const currentTime = new Date().getTime();
    if (user) {
      if (!user.verified_account) {
        if (
          currentTime < user.verification_code_expiry_time &&
          req.body.code == user.verification_code
        ) {
          user.verified_account = true;
          const update = await updateUser(user.email, user);
          if (update) {
            // send token and details
            user.password = "";
            const jwtPayload = { email: user.email, role: user.role };
            const secret = process.env.JWT_SECRET || "my_jwt_secret";
            const token = jwt.sign(jwtPayload, secret, { expiresIn: "2d" });
            return generalResponse(
              res,
              200,
              "success",
              null,
              { token, details: user },
              true
            );
          }
          throw { myError: "something went wrong...!" };
        } else {
          if (currentTime > user.verification_code_expiry_time) {
            throw { myError: "your code is expired...!" };
          }
          throw { myError: "wrong code entered...!" };
        }
      } else {
        throw { myError: "you are already registered with us :)" };
      }
    } else {
      throw { myError: "first register yourself...." };
    }
  } catch (error) {
    let myError = "something went wrong";
    if (error?.myError) {
      myError = error?.myError;
    }
    generalResponse(res, 400, "error", myError, error, true);
  }
};

export const npiLookup = async (req, res) => {
  try {
    const { npi_number } = req.query;
    await axios
      .get(process.env.NPI_LOOKUP_API, {
        params: {
          number: npi_number,
          version: "2.1",
        },
      })
      .then((npiResponse) => {
        if (npiResponse.status === 200) {
          generalResponse(res, 200, "success", null, npiResponse.data);
        }
      })
      .catch((err) => {
        generalResponse(res, 400, "error", "Something went wrong", err, true);
      });
  } catch (error) {
    generalResponse(res, 500, "error", "Internal server error", error, true);
  }
};

export const universityLookup = async (req, res) => {
  try {
    const { domain } = req.query;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const universitiesJSON = await JSON.parse(
      readFileSync(
        path.join(__dirname, "../data/world_universities_and_domains.json"),
        "utf8"
      )
    );
    const response =
      (await universitiesJSON.find((item) =>
        item.domains.toString().toUpperCase().includes(domain.toUpperCase())
      )) || null;
    generalResponse(res, 200, "success", null, response);
  } catch (error) {
    generalResponse(res, 500, "error", "Internal server error", error, true);
  }
};

export const isUserExists = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await userExistWithEmail(email, {
      type: "include",
      attribute: [
        "first_name",
        "last_name",
        "email",
        "role",
        "verified_account",
      ],
    });
    generalResponse(res, 200, "success", null, user);
  } catch (error) {
    generalResponse(res, 400, "error", "Something went wrong", error, true);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (user) {
      const { mail, codeExpireTime, randomCode } = prepareVerificationCodeForEmailConfirmation(user.first_name, user.email);
      user.verification_code = randomCode;
      user.verification_code_expiry_time = codeExpireTime;
      const update = await updateUser(req.body.email, user);
      if (update) {
        return generalResponse(res, 200, "success", "Verification code sent to your email", null, true);
      }
    }
    return generalResponse(res, 400, "error", "Email not found", null, true);
  } catch (error) {
    return generalResponse(res, 400, "error", "Something went wrong", error, true);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (user && req.body.code == user.verification_code && new Date().getTime() < user.verification_code_expiry_time) {
      user.password = bcrypt.hashSync(req.body.newPassword, 10);
      const update = await updateUser(req.body.email, user);
      if (update) {
        return generalResponse(res, 200, "success", "Password reset successful", null, true);
      }
    }
    return generalResponse(res, 400, "error", "Invalid verification code", null, true);
  } catch (error) {
    return generalResponse(res, 400, "error", "Something went wrong", error, true);
  }
};