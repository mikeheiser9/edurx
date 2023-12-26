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
// import { SignUpModal } from "./components/signUpModal";
// import { useModal } from "@/hooks";

export default function Welcome(props: any) {
  const router = useRouter();

  const [showIntro, setShowIntro] = useState(true);
  // const signUpModal = useModal();
  const onSignUp = () => {
    router.push("/signin");
  };

  //   useEffect(() => {
  //     // Disable scrolling if the welcome screen is showing
  //     document.body.style.overflow = showIntro ? 'hidden' : 'scroll';
  //   }, [showIntro]);

  return (
    <>
      {/* <SignUpModal signUpModal={signUpModal} /> */}
      <AnimationProvider>
        {/* {showIntro && <Intro onAnimationComplete={handleAnimationComplete} {...props} />} */}

        <div
          className="relative w-screen flex justify-center items-start bg-eduLightGray overflow-x-hidden"
          id="smooth-wrapper"
        >
          <div
            className="relative max-w-[1640px] w-full h-auto flex justify-center items-center flex-col px-[5%]"
            id="smooth-content"
          >
            <Header onSignUp={onSignUp} />
            <Domino />
            <Hero />
            <CompOne onSignUp={onSignUp} />
            <CompTwo onSignUp={onSignUp} />
            <CompThree onSignUp={onSignUp} />
            <Footer />
          </div>
        </div>
      </AnimationProvider>
    </>
  );
}
