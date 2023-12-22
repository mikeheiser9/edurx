import { userModel } from "../model/user/user.js";
import { findUserByEmail } from "../repository/user.js";
import { generalResponse, trimFields } from "../util/commonFunctions.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    req.body = trimFields(req.body);
    let user = await findUserByEmail(req.body.email, {
      type: "include",
      attribute: [
        "first_name",
        "last_name",
        "email",
        "role",
        "verified_account",
        "password",
      ],
    });
    if (user) {
      if (user.role === USER_ROLES.super_admin) {
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
          throw "Incorrect Email/Password!!";
        }
      } else {
        throw "You Don't have enough Permission!!";
      }
    } else {
      throw "User does not Exist!";
    }
  } catch (error) {
    return generalResponse(
      res,
      400,
      "error",
      { error: error ? error : "Something Went Wrong while Login." },
      "",
      true
    );
  }
};

export const fetchUsersByAdmin = async (req, res) => {
  try {
    const list = await userModel
      .find()
    return generalResponse(res, 200, "success", "", list, true);
  } catch (error) {
    return generalResponse(
      res,
      400,
      "error",
      { error: error ? error : "Something Went Wrong while Login." },
      "",
      true
    );
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try{
  const { acknowledged } = await userModel.deleteOne({
    _id: req.body.id,
  });
  if(acknowledged){
    return generalResponse(
      res,
      200,
      "success",
      "User Account Deleted Successfully!!",
      null,
      true
    );
  }else {
    throw "Unable to Delete User Account!"
  }
} catch (error) {
  return generalResponse(
    res,
    400,
    "error",
    { error: error ? error : "Something Went Wrong while Delete User." },
    "",
    true
  );
}
};

export const updateUserByAdmin = async (id, user) => {
  return await userModel.findOneAndUpdate(
    {
      _id:id.toLowerCase(),
    },
    {
      ...user,
    }
  );
};