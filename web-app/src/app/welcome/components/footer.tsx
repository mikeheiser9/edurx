import React from 'react';
import Image from 'next/image';
import EduLogo from '@/assets/imgs/edurx-logo.svg';

const date = new Date();

export default function Footer() {
  return (
    <div className='relative w-full h-[150px] flex flex-col items-center justify-between py-[20px]'>
        <div className='relative flex justify-center items-center w-full'>
            <Image src={EduLogo} alt='Edu Logo' width={65} />
        </div>
        <div className='relative flex justify-center items-center font-body w-full'>
        <p className='font-body'>© {date.getFullYear()} EduRx. All Rights Reserved</p>
        </div>
    </div>
  );
};