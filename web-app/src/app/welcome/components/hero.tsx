import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import SepTop from '@/assets/imgs/hero-sep-top.svg';
import EduHeroLogo from '@/assets/imgs/edurx-logo.svg';
import SepBtm from '@/assets/imgs/hero-sep-btm.svg'
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin'

export default function Header() {

  gsap.registerPlugin(TextPlugin);

  const wordRef = useRef(null);
  const words = ['education', 'organization', 'connections', 'career'];

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    words.forEach((word) => {
      tl.to(wordRef.current, {
        duration: 2,
        text: word,
        ease: "none"
      }).to(wordRef.current, {
        duration: 1,
        text: "",
        ease: "none",
        delay: 0.5
      });
    });
  
    return () => {
      tl.kill();
    };

  }, [])

  useEffect(() => {

  }, [])

  return (
    <>
    <div className='relative w-full h-full flex items-center just mx-[5%] my-[50px] flex-col'>
      <div className='relative w-[90%] flex justify-center items-center flex-col'>
        <div className='relative'>
            <Image src={SepTop} alt={'hero-top-line'} />
        </div>
        <div className='relative my-[50px] flex flex-row flex-nowrap w-[90%] justify-center'>
          <div className='w-5/12 flex flex-col justify-center items-end'>
            <div className='relative h-full'>
              <h3 className='relative text-[80px] font-headers uppercase leading-none'>Elevate</h3>
            </div>
            <div className='absolute flex flex-row flex-nowrap min-w-full justify-end mt-[100px] font-headers text-right'>
              <p className='text-[40px] text-eduLightBlue uppercase leading-none'>Your </p>
              <p className='text-[40px] text-eduLightBlue uppercase leading-none ml-[10px]' ref={wordRef}></p>
            </div>
          </div>
          <div className='w-2/12 flex flex-col justify-center items-center'>
            <div className='relative w-full h-full'>
              <Image src={EduHeroLogo} alt={'eduRx-logo'} fill />
            </div>
          </div>
          <div className='w-5/12 flex flex-col justify-center items-start ml-[35px]'>
            <h3 className='text-[60px] text-eduLightBlue font-headers leading-none uppercase'>On our<br />platform</h3>
          </div>
        </div>
        <div className='relative'>
            <Image src={SepBtm} alt={'hero-btm-line'} />
        </div>
      </div>
    </div>

    <div className='relative w-screen h-[800px] flex flex-col justify-center items-center'>
      <h1 className='text-[100px]'>hi there</h1>
    </div>
    </>
  );
};