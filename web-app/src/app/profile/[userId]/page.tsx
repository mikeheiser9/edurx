"use client";
import { requireAuthentication } from "@/components/requireAuthentication";
import React, { useEffect } from "react";
import { UserProfile } from "../components/profile";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";

const PublicProfile = (): React.ReactElement => {
  const user = useParams();
  const router = useRouter();
  const loggedInUser = useSelector(selectUserDetail);
  const { userId } = user;
  const isLoggedInUser = userId === loggedInUser?._id;

  useEffect(() => {
    if (isLoggedInUser) router.replace("/profile");
  }, []);

  if (!userId || isLoggedInUser) return <></>;
  return (
    <UserProfile userId={userId as string} isSelfProfile={isLoggedInUser} />
  );
};

export default requireAuthentication(PublicProfile);
