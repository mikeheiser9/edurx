import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import SepTop from '@/assets/imgs/hero-sep-top.svg';
import SepBtm from '@/assets/imgs/hero-sep-btm.svg';
import Domino from '@/assets/svg-components/domino';
import { gsap } from 'gsap';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { useAnimationContext } from '@/util/animationContext';
import debounce from 'lodash/debounce';

export default function Hero() {

  const { registerAnimation } = useAnimationContext();

  const wordRef = useRef(null);
  const words = ['education', 'organization', 'connections', 'career'];

  const circleOne = useRef<SVGGElement | null>(null);
  const circleTwo = useRef(null);
  const circleThree = useRef(null);
  const circleFour = useRef(null);
  const circleFive = useRef(null);
  const rxOne = useRef(null);
  const rxTwo = useRef(null);
  // const hiddenPathOne = useRef<SVGPathElement>(null);

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

    registerAnimation(tl);
    return () => {
      tl.kill();
    };
}, []);

const setupAnimation = () => {
  const circleElement = circleOne.current;
  
  if (!circleElement) return;

  // Define a simple vertical path for the circle to follow
  const pathD = `M${690.5213623046875} ${175.23997497558594} V${document.documentElement.scrollHeight}`;

  gsap.to(circleElement, {
    // motionPath: {
    //   path: pathD,
    //   alignOrigin: [0.5, 0.5],
    // },
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      markers: true
    }
  });
};

useEffect(() => {
  const handleResize = debounce(() => {
    setupAnimation();
  }, 250);

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);


useEffect(() => {
  if (circleOne.current) {
    const position = circleOne.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    console.log("CircleOne Position:", {
      top: position.top + scrollTop,
      left: position.left + scrollLeft,
      right: position.right + scrollLeft,
      bottom: position.bottom + scrollTop,
      width: position.width,
      height: position.height
    });
  }
}, []);


useEffect(() => {
  setupAnimation();
  return () => {
      gsap.killTweensOf(circleOne.current);
  };
}, []);

// useEffect(() => {
//   MotionPathHelper.create(circleOne.current);
// }, []);

  return (
    <>
    <div className='relative w-full h-full flex items-center justify-center mx-[5%] my-[50px] flex-col'>
        <Domino 
          forwardedRefs={{
              circleOne, 
              circleTwo, 
              circleThree, 
              circleFour, 
              circleFive, 
              rxOne, 
              rxTwo,
              // hiddenPathOne: hiddenPathOne,

          }} 
          />
      <div className='relative w-[90%] flex justify-center items-center flex-col st-one'>
        <div className='relative w-full'>
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
    </>
  );
};