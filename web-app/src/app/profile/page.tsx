"use client";

import { requireAuthentication } from "@/components/requireAuthentication";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import React from "react";
import { useSelector } from "react-redux";

import { UserProfile } from "./components/profile";

const Profile = (): React.ReactElement => {
  const loggedInUser = useSelector(selectUserDetail);

  return <UserProfile userId={loggedInUser?._id} />;
};

export default requireAuthentication(Profile);
