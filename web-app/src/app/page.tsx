'use client';
import React, { useState, useRef, useEffect, createContext } from 'react';
import { useRouter } from 'next/navigation';
import Header from './welcome/components/header';
import Hero from './welcome/components/hero';
import Intro from './welcome/components/intro';
import CompOne from './welcome/components/compOne';
import CompTwo from './welcome/components/compTwo';
import CompThree from './welcome/components/compThree';
import { AnimationProvider } from '@/util/animationContext';
import Footer from './welcome/components/footer';

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
            <Footer />
        </div>
      </div>
    </AnimationProvider>
    </>
  );
}
