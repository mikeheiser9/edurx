'use client';
import React, { useState, useRef, useEffect, createContext } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/header';
import Hero from './components/hero';
import Intro from './components/intro';
import CompOne from './components/compOne';
import CompTwo from './components/compTwo';
import CompThree from './components/compThree';
import { AnimationProvider } from '@/util/animationContext';

export default function Welcome(props: any) {

  const router = useRouter();

  const [showIntro, setShowIntro] = useState(true); 

  const handleAnimationComplete = () => {
    setShowIntro(false);  // Hide welcome screen when animation is done
  };

//   useEffect(() => {
//     // Disable scrolling if the welcome screen is showing
//     document.body.style.overflow = showIntro ? 'hidden' : 'scroll';
//   }, [showIntro]);

  return (
    <>
    <AnimationProvider>
      {/* {showIntro && <Intro onAnimationComplete={handleAnimationComplete} {...props} />} */}

      <div className='relative w-screen flex justify-center items-start bg-eduLightGray overflow-x-hidden'>
        <div className='relative max-w-[1640px] w-full h-auto flex justify-center items-center flex-col px-[5%]'>
            <Header />
            <Hero />
            <CompOne />
            <CompTwo />
            <CompThree />
        </div>
      </div>
    </AnimationProvider>
    </>
  );
}
