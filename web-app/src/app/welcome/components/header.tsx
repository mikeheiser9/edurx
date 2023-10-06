import React from "react";
import Image from "next/image";
// import EduLogo from "@/assets/imgs/edurx-logo.svg";
import EduLogo from "../../../assets/imgs/eduRx-logo-2.png";


interface Props {
  signUpModal: UseModalType;
}

export default function Header({ signUpModal }: Props) {
  return (
    <div className='relative w-full h-full flex items-center justify-between py-[30px] ipad:pb-[15px]'>
        <div className='relative w-[55px] ipad:w-[35px]'>
            <Image src={EduLogo} alt='Edu Logo' width={300} />
        </div>
        <div className='relative'>
            <button 
              className='border border-eduBlack rounded-[5px] px-[15px] py-[4px] font-body text-eduBlack hover:bg-eduYellow hover:border-eduYellow ease-in-out duration-500 iphone:px-[8px]'
              onClick={signUpModal?.openModal}
            >
             <span className='font-body text-[14px] iphone:text-[12px]'>Sign Up / Sign in</span>
            </button>
        </div>
    </div>
  );
}
