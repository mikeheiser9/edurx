"use client";
import { requireAuthentication } from "@/components/requireAuthentication";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { getFullName } from "@/util/interface/commonUtils";
import React from "react";
import { useSelector } from "react-redux";

const Profile = (): React.JSX.Element => {
  const user = useSelector(selectUserDetail);
  console.log(user);

  return (
    <React.Fragment>
      <div className="container shadow-md">
        <h1>Profile</h1>
        <p>{getFullName(user?.first_name, user?.last_name)}</p>
        <p>{user?.email}</p>
        <p>{user?.phone}</p>
        <p>{user?.addresses}</p>
        <p>{user?.city}</p>
        <p>{user?.state}</p>
        <p>{user?.zip}</p>
      </div>
    </React.Fragment>
  );
};

export default requireAuthentication(Profile, true);
