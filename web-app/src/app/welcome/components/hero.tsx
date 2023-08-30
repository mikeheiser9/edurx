import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import SepTop from '@/assets/imgs/hero-sep-top.svg';
import SepBtm from '@/assets/imgs/hero-sep-btm.svg';
import Domino from '@/assets/svg-components/domino';
import { gsap } from 'gsap';
import { MotionPathHelper } from 'gsap/MotionPathHelper';
import { useAnimationContext } from '@/util/animationContext';

export default function Header() {

  const { registerAnimation } = useAnimationContext();

  const wordRef = useRef(null);
  const words = ['education', 'organization', 'connections', 'career'];

  const circleOne = useRef(null);
  const circleTwo = useRef(null);
  const circleThree = useRef(null);
  const circleFour = useRef(null);
  const circleFive = useRef(null);
  const rxOne = useRef(null);
  const rxTwo = useRef(null);

  const getRandomPath = () => {
    const randomY = Math.floor(Math.random() * 100) - 50;
    return `M0,0 L0,${500 + randomY}`;
}

const [viewBoxDimensions, setViewBoxDimensions] = useState({
  width: window.innerWidth,
  height: window.innerHeight
});

const [translate, setTranslate] = useState({
  x: (10 / 100) * window.innerWidth,
  y: (20 / 100) * window.innerHeight
});

useEffect(() => {
  const handleResize = () => {
      setViewBoxDimensions({
          width: window.innerWidth,
          height: window.innerHeight
      });
      setTranslate({
          x: (45 / 100) * window.innerWidth,
          y: (23 / 100) * window.innerHeight
      });
  };

  handleResize();

  window.addEventListener('resize', handleResize);

  return () => {
      window.removeEventListener('resize', handleResize);
  };
}, []);

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

    // If you want to register this animation with the context
    registerAnimation(tl);
  
    return () => {
      tl.kill();
    };
}, []);

// ... (rest of the imports and code)

const setupAnimation = () => {
  // Kill any existing animations on the target element
  gsap.killTweensOf(circleOne.current);

  // const motionPath = `M${translate.x},${translate.y} L${translate.x},${translate.y + 500}`;
  const motionPath = "M293.03899,107.271 C-94.33601,297.612 511.07899,437.81233 511.07899,604.479"

  gsap.to(circleOne.current, {
      scrollTrigger: {
          trigger: ".st-one",
          start: "top center",
          end: "+=500",
          scrub: true,
          markers: true
      },
      motionPath: motionPath,
      duration: 5
  });
};

useEffect(() => {
  setupAnimation();

  return () => {
      gsap.killTweensOf(circleOne.current);
  };
}, [translate]);

// useEffect(() => {
//   MotionPathHelper.create(circleOne.current);
// }, []);

  return (
    <>
    <div className='relative w-full h-full flex items-center just mx-[5%] my-[50px] flex-col'>
      <div className='relative w-[90%] flex justify-center items-center flex-col st-one'>
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
              <Domino 
                viewBoxDimensions={viewBoxDimensions}
                translate={translate} 
                forwardedRefs={{
                   circleOne, 
                   circleTwo, 
                   circleThree, 
                   circleFour, 
                   circleFive, 
                   rxOne, 
                   rxTwo 
                }} 
                />
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