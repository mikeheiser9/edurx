"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/header";
import Domino from "./components/domino";
import Hero from "./components/hero";
import CompOne from "./components/compOne";
import CompTwo from "./components/compTwo";
import CompThree from "./components/compThree";
import Footer from "./components/footer";
import { AnimationProvider } from "@/util/animationContext";
import { SignUpModal } from "./components/signUpModal";
import { useModal } from "@/hooks";

export default function Welcome(props: any) {
  const router = useRouter();

  const [showIntro, setShowIntro] = useState(true);
  const signUpModal = useModal();

  const handleAnimationComplete = () => {
    setShowIntro(false); // Hide welcome screen when animation is done
  };

  //   useEffect(() => {
  //     // Disable scrolling if the welcome screen is showing
  //     document.body.style.overflow = showIntro ? 'hidden' : 'scroll';
  //   }, [showIntro]);

  return (
    <>
      <SignUpModal signUpModal={signUpModal} />
      <AnimationProvider>
        {/* {showIntro && <Intro onAnimationComplete={handleAnimationComplete} {...props} />} */}

        <div className="relative w-screen flex justify-center items-start bg-eduLightGray overflow-x-hidden" id="smooth-wrapper">
          <div className="relative max-w-[1640px] w-full h-auto flex justify-center items-center flex-col px-[5%]" id="smooth-content">
            <Header signUpModal={signUpModal} />
            <Domino />
            <Hero />
            <CompOne signUpModal={signUpModal} />
            <CompTwo signUpModal={signUpModal} />
            <CompThree signUpModal={signUpModal} />
            <Footer />
          </div>
        </div>
      </AnimationProvider>
    </>
  );
}
