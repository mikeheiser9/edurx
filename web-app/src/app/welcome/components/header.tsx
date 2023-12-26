import React from "react";
import Image from "next/image";
// import EduLogo from "@/assets/imgs/edurx-logo.svg";
import EduLogo from "../../../assets/imgs/eduRx-logo-2.png";

interface Props {
  onSignUp: () => void;
}

export default function Header({ onSignUp }: Props) {
  return (
    <div className="relative w-full h-full flex items-center justify-between py-[30px] ipad:pb-[15px]">
      <div className="relative w-[55px] ipad:w-[35px]">
        <Image src={EduLogo} alt="Edu Logo" width={300} />
      </div>
      <div className="relative w-full">
        <button
          className="border absolute right-0 border-eduBlack z-50 rounded-[5px] px-[15px] py-[4px] font-body text-eduBlack hover:bg-eduYellow hover:border-eduYellow ease-in-out duration-500 iphone:px-[8px]"
          onClick={onSignUp}
        >
          <span className="font-body text-[14px] iphone:text-[12px]">
            Sign Up / Sign in
          </span>
        </button>
      </div>
    </div>
  );
}
