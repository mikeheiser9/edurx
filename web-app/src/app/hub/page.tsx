"use client";
import DashboardLayout from "@/components/dashboardLayout";
import { requireAuthentication } from "@/components/requireAuthentication";
import React from "react";

const Page = () => {
  return (
    <DashboardLayout leftPanelChildren={<div>Hub menu left panel here</div>}>
      Hub menu comp here
    </DashboardLayout>
  );
};

export default requireAuthentication(Page);
