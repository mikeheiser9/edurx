import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import SepTop from '@/assets/imgs/hero-sep-top.svg';
import { gsap } from 'gsap';
import { useAnimationContext } from '@/util/animationContext';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {

  const { registerAnimation } = useAnimationContext();
  gsap.registerPlugin(ScrollTrigger);

  const wordRef = useRef(null);
  const words = ['your education', 'collaboration', 'your research', 'the conversation', 'your network', 'your career', 'your practice'];
  const sepOne = useRef(null);
  const sepTwo = useRef(null);
  const elRef = useRef(null);
  const edRef = useRef(null);


  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    words.forEach((word) => {
      tl.to(wordRef.current, {
        duration: 3,
        text: word,
        ease: "none"
      }).to(wordRef.current, {
        duration: 1,
        text: "",
        ease: "none",
        delay: 0.5
      });
    });

    registerAnimation(tl);
    return () => {
      tl.kill();
    };
}, []);

useEffect(() => {
  const st = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: '+760px',
      scrub: true,
      markers: true
    }
  });
  st.to(sepOne.current, {opacity: 0, duration: 1}, 0)
    .to(sepTwo.current, {opacity: 0, duration: 1}, 0)
    .to(elRef.current, {opacity: 0, duration: 1}, 0)
    .to(edRef.current, {opacity: 0, duration: 1}, 0)
    .to(wordRef.current, {opacity: 0, duration: 1}, 0)

}, []);

  return (
    <>
      <div className='relative w-full h-full flex items-center justify-center mx-[5%] my-[50px] flex-col small:my-[25px] ipad:mt-0'>
        <div className='relative w-[90%] flex justify-center items-center flex-col st-one ipad:my-[25px] tablet-lg:w-[95%] small:my-0'>
          <div className='relative w-full'>
            <Image src={SepTop} alt={'hero-top-line'} ref={sepOne} />
          </div>
          <div className='relative my-[50px] flex flex-row flex-nowrap w-[90%] justify-center ipad:flex-col ipad:justify-center ipad:items-center ipad:mb-[25px]'>
            <div className='w-5/12 flex flex-col justify-center items-end ipad:w-full ipad:order-2 ipad:items-center ipad:mt-[20px]'>
              <div className='relative h-full'>
                <h3 className='relative text-[80px] font-headers uppercase leading-none x-large:text-[60px] tablet-lg:text-[45px] small:text-[40px] iphone:text-[35px]' ref={elRef}>
                  Elevate
                </h3>
              </div> 
              <div className='absolute flex flex-row flex-nowrap min-w-full justify-end mt-[35px] font-headers text-right ipad:relative ipad:flex-col ipad:justify-center ipad:order-3 ipad:min-h-[35px] ipad:items-center ipad:mt-[20px]'>
                <p className='text-[40px] text-eduLightBlue uppercase leading-none font-semibold x-large:text-[30px] tablet-lg:text-[26px] ipad:text-[30px] ipad:text-center small:text-[26px] iphone:text-[20px]' ref={wordRef}>
                </p>
              </div>
            </div>
            <div className='w-2/12 flex flex-col justify-center items-center mt-[-35px] ipad:w-full ipad:order-1 min-h-[220px]'>
              <div className='relative w-full h-full block ml-[35px] ipad:w-[80px] ipad:ml-0'>
                {/* <DominoBlack /> */}
              </div>
            </div>
            <div className='w-5/12 flex flex-col justify-center items-start ml-[35px] mt-[-50px] ipad:w-full ipad:order-4 ipad:items-center ipad:ml-0 ipad:mt-[15px]'>
              <h3 className='text-[60px] font-semibold text-eduLightBlue font-headers leading-none x-large:text-[50px] tablet-lg:text-[40px] small:text-[40px] iphone:text-[30px]' ref={edRef}>
                On EduRx
              </h3>
            </div>
          </div>
          <div className='relative'>
            <Image src={SepTop} alt={'hero-btm-line'} className='rotate-180' ref={sepTwo} />
          </div>
        </div>
      </div>
    </>
  );
  
};