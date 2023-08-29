'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Header from './components/header';
import Hero from './components/hero';
import Intro from './components/intro';

export default function Welcome(props: any) {

  gsap.registerPlugin(ScrollTrigger);

  const router = useRouter();

  const [showIntro, setShowIntro] = useState(true); 

  const handleAnimationComplete = () => {
    setShowIntro(true);  // Hide welcome screen when animation is done
  };

  useEffect(() => {
    // Disable scrolling if the welcome screen is showing
    document.body.style.overflow = showIntro ? 'hidden' : 'auto';
  }, [showIntro]);

  return (
    <>
      {showIntro && <Intro onAnimationComplete={handleAnimationComplete} {...props} />}

      <div className='relative w-screen h-screen flex justify-center items-start bg-eduLightGray overflow-x-hidden overflow-y-auto'>
        <div className='relative max-w-[1640px] w-full h-auto flex justify-center items-center flex-col px-[5%]'>
            <Header />
            <Hero />

        </div>
      </div>
    </>
  );
}
