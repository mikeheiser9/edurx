import { userModel } from "../model/user.js";

export const userExistWithEmail = async (email) => {
  const user = await userModel.findByEmail(email);
  return user ? { user, isExist: true } : { user, isExist: false };
};
export const updateUser = async (email, user) => {
  return await userModel.findOneAndUpdate(
    {
      email,
    },
    {
      ...user,
    }
  );
};
export const storeUserRegistrationInfoInDb = async (info) => {
  return await new userModel(info).save();
};
export const findUserByEmail = async (email,excludeAttributeList=null) => {
  return await userModel.findByEmail(email,excludeAttributeList);
};
