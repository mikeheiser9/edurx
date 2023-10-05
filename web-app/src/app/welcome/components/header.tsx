import React from "react";
import Image from "next/image";
import EduLogo from "@/assets/imgs/edurx-logo.svg";

interface Props {
  signUpModal: UseModalType;
}

export default function Header({ signUpModal }: Props) {
  return (
    <div className="relative w-full h-[90px] flex items-center justify-between py-[10px]">
      <div className="relative">
        <Image src={EduLogo} alt="Edu Logo" width={65} />
      </div>
      <div className="relative">
        <button
          onClick={signUpModal?.openModal}
          className="border border-eduBlack rounded-[5px] px-[15px] py-[4px] font-body text-eduBlack hover:bg-eduYellow hover:border-eduYellow ease-in-out duration-500"
        >
          Sign Up / Sign in
        </button>
      </div>
    </div>
  );
}
