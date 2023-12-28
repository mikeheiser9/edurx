import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { findUserByEmail } from "../repository/user.js";
import {
  findAndPaginate,
  generalResponse,
  trimFields,
} from "../util/commonFunctions.js";
import { userModel } from "../model/user/user.js";

import {
  USER_ROLES,
  taxonomyCodeToProfessionalMapping,
} from "../util/constant.js";
import axios from "axios";
import { searchCategoryFilterByName } from "../repository/post.js";
import { resourceModel } from "../model/resource/resource.js";
import { categoryFilterModal } from "../model/post/categoryTag.js";

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
            false
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
      error ? error : "Something Went Wrong while Login.",
      "",
      false
    );
  }
};

export const fetchUsersByAdmin = async (req, res) => {
  try {
    const searchKeyword = req.query.search;
    let query = {};
    if (searchKeyword && searchKeyword.trim() !== "") {
      query = { username: { $regex: searchKeyword, $options: "i" } };
    }
    const list = await userModel
      .find(query)
      .select(
        "first_name last_name username email password role npi_number taxonomy joined verified_account id npi_designation"
      )
      .sort({ first_name: 1 });
    return generalResponse(res, 200, "success", "", list, false);
  } catch (error) {
    return generalResponse(
      res,
      400,
      "error",
      { error: error ? error : "Something Went Wrong while Login." },
      "",
      false
    );
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { acknowledged } = await userModel.deleteOne({
      _id: req.body.id,
    });
    if (acknowledged) {
      return generalResponse(
        res,
        200,
        "success",
        "User Account Deleted Successfully!!",
        null,
        false
      );
    } else {
      throw "Unable to Delete User Account!";
    }
  } catch (error) {
    return generalResponse(
      res,
      400,
      "error",
      { error: error ? error : "Something Went Wrong while Delete User." },
      "",
      false
    );
  }
};

const npiLookupAdminReturnAddress = async (npi_number) => {
  try {
    const npiRes = await axios.get(process.env.NPI_LOOKUP_API, {
      params: {
        number: npi_number,
        version: "2.1",
      },
    });

    const npiData = npiRes?.data?.results?.[0] || null;
    const isValid = npiRes?.data?.result_count > 0;
    if (npiData && isValid) {
      if (npiData.taxonomies) {
        const validNpiCode = Object.keys(taxonomyCodeToProfessionalMapping);
        const exists = npiData.taxonomies
          .map((taxonomy) => taxonomy.code)
          .some((code) => validNpiCode.includes(code));

        if (exists) {
          const primaryTaxonomy = npiData.taxonomies.find(
            (taxonomy) => taxonomy?.primary
          );
          if (primaryTaxonomy) {
            const address = npiData.addresses?.map((address) => {
              return address?.address_1;
            });
            const state = primaryTaxonomy?.state;
            const zip_code = npiData.addresses[0]?.postal_code;
            const npi_designation =
              taxonomyCodeToProfessionalMapping[primaryTaxonomy.code];
            if (npi_designation)
              return { data: { address, state, zip_code, npi_designation } };
          }
        }
      }
    }
    throw "Invalid Npi Number";
  } catch (error) {
    return { data: null };
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const username = req.body.username.trim();
    const email = req.body.email.trim().toLowerCase();
    const userData = req.body;

    // encrypt Password
    if (userData.password.trim() !== "")
      userData.password = await bcrypt.hash(userData.password, 10);
    else delete userData["password"];

    // user Exist
    const isUserExist = await userModel
      .findById({
        _id: userId,
      })
      .select("email username npi_number");

    if (isUserExist) {
      // Exclude current user check if username or email exist with another user
      const isEmailOrUsernameExist = await userModel.findOne({
        $or: [
          { email: email, _id: { $ne: userId } },
          { username: username.trim(), _id: { $ne: userId } },
        ],
      });
      if (isEmailOrUsernameExist) {
        if (isEmailOrUsernameExist.username == username.trim())
          throw "username-userExistWithUsername";
        else if (isEmailOrUsernameExist.email == email.trim())
          throw "email-userExistWithEmail";
      } else {
        if (
          req.body.role === USER_ROLES.professional &&
          isUserExist.npi_number !== userData.npi_number
        ) {
          // NPI Validation and Address Update
          const { data } = await npiLookupAdminReturnAddress(
            req.body.npi_number
          );
          if (data) {
            await userModel.findByIdAndUpdate(userId, {
              ...userData,
              ...data,
              addresses: data.address,
            });
          } else {
            throw "npi_number-invalidNpi";
          }
        } else {
          await userModel.findByIdAndUpdate(userId, userData);
        }
      }
    } else {
      throw "userNotFound";
    }
    return generalResponse(res, 200, "success", "", "", false);
  } catch (error) {
    return generalResponse(
      res,
      400,
      "error",
      error ? error : "Something Went Wrong while Updating User on admin side.",
      "",
      false
    );
  }
};

export const fetchCategoryByAdmin = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const query = {
      $and: [{ isDeleted: { $ne: true } }, { type: "category" }],
    };
    const searchResult = await findAndPaginate(
      categoryFilterModal,
      query,
      page && Number(page),
      limit && Number(limit)
    );
    return generalResponse(res, 200, "success", "", searchResult);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

export const deleteResourceById = async (req, res) => {
  try {
    await resourceModel.findByIdAndUpdate(req.body.id, {
      isDeleted: true,
    });
    return generalResponse(
      res,
      200,
      "success",
      "Resource Deleted Successfully!!",
      null,
      false
    );
  } catch (error) {
    return generalResponse(
      res,
      400,
      "error",
      { error: error ? error : "Something Went Wrong while Delete User." },
      "",
      false
    );
  }
};

export const updateResourceById = async (req, res) => {
  try {
    const id = req.body._id;
    const resourceData = req.body;
    resourceData.isResource == "resource"
      ? (resourceData.isResource = true)
      : (resourceData.isResource = false);
    await resourceModel.findByIdAndUpdate(id, resourceData);
    return generalResponse(res, 200, "success", "", "", false);
  } catch (error) {
    return generalResponse(res, 400, "error", error.message, error, false);
  }
};

export const insertResource = async (req, res) => {
  try {
    const resourceData = req.body;
    resourceData.isResource == "resource"
      ? (resourceData.isResource = true)
      : (resourceData.isResource = false);
    await new resourceModel(resourceData).save();
    return generalResponse(res, 200, "success", "", "", false);
  } catch (error) {
    return generalResponse(
      res,
      400,
      "error",
      error ? error : "Something Went Wrong while Inserting Resources.",
      "",
      false
    );
  }
};
