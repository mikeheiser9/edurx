"use client";
import { requireAuthentication } from "@/components/requireAuthentication";
import React from "react";
import { UserProfile } from "../components/profile";
import { useParams } from "next/navigation";

const PublicProfile = (): React.ReactElement => {
  const user = useParams();
  const { userId } = user;
  if (!userId) return <></>;
  return <UserProfile userId={userId as string} viewMode />;
};

export default requireAuthentication(PublicProfile);
