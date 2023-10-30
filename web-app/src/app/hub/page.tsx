"use client";
import DashboardLayout from "@/components/dashboardLayout";
import { requireAuthentication } from "@/components/requireAuthentication";
import React from "react";

const Page = () => {
  return <>Hub menu comp here</>;
};

export default requireAuthentication(Page);
