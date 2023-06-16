"use client";
import { useRouter } from "next/navigation";
import ProfessionalImg from "@/assets/icons/user.svg";
import StudentImg from "@/assets/icons/student.svg";
import CeProviderImg from "@/assets/icons/provider.svg";
import IntitutionImg from "@/assets/icons/institution.svg";

import { AccountCard } from "@/components/AccountCard";
import React from "react";

export default function ChooseAccountType() {
  const router = useRouter();
  interface accountTypes {
    title: string;
    icon: string;
    isDisabled: boolean;
    type: string;
  }
  const accountTypes = [
    {
      title: "Professional Account",
      icon: ProfessionalImg,
      isDisabled: false,
      type: "professional",
    },
    {
      title: "Student Account",
      icon: StudentImg,
      isDisabled: false,
      type: "student",
    },
    {
      title: "Institution",
      icon: IntitutionImg,
      isDisabled: true,
      type: "institution",
    },
    {
      title: "CE Provider",
      icon: CeProviderImg,
      isDisabled: true,
      type: "provider",
    },
  ];

  function handleClick(type: string) {
    router.push(`/signup/${type}`);
  }

  return (
    <React.Fragment>
      <div className="flex flex-col text-white items-center p-4 gap-2">
        <label className="text-3xl">Create Accout</label>
        <label className="opacity-60">Please make a selection</label>
      </div>

      <div className="grid-cols-2 grid gap-1">
        {accountTypes?.map((item: accountTypes, index: number) => (
          <AccountCard
            key={index}
            icon={item.icon}
            isDisabled={item.isDisabled}
            onClick={() => handleClick(item.type)}
            title={item.title}
          />
        ))}
      </div>
    </React.Fragment>
  );
}
