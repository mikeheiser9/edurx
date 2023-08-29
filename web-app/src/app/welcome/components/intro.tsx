import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import EduIntroLogo from '@/assets/imgs/edurx-logo.svg';
import Circle from '@/assets/imgs/circle.svg';
import Star from '@/assets/imgs/star.svg';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

interface IntroProps {
    onAnimationComplete: () => void;
}

const Intro = ({ onAnimationComplete }: IntroProps) => {

gsap.registerPlugin(MorphSVGPlugin);


const textOne = "welcome to"
const textTwo = "EduRx"

const lettersOne = Array.from(textOne);
const lettersTwo = Array.from(textTwo);

const introRef = useRef(null);
const logoRef = useRef(null);

useEffect(() => {
    const tl = gsap.timeline({ onComplete: onAnimationComplete })

    tl.fromTo(gsap.utils.toArray('.animateTextOne'), 
    { opacity: 0 },  // starting properties
    { 
      duration: 0.9,
      opacity: 1,  // ending properties
      stagger: 0.1,
      ease: "power2.out"
    })
    .fromTo(logoRef.current, 
        { opacity: 0 },  // starting properties
        {
          duration: 1,
          opacity: 1,  // ending properties
          ease: "power2.out"
        })
    .fromTo(gsap.utils.toArray('.animateTextTwo'), 
        { opacity: 0 },  // starting properties
        {
        duration: 0.5,
        opacity: 1,  // ending properties
        stagger: 0.1,
        ease: "power2.out"
    })
    .to(logoRef.current, {
        duration: 2,
        scale: 15,  // Adjust this value based on your needs
        ease: "power2.inOut"
    })
    // Fade out the entire intro screen
    .to(introRef.current, {
        duration: 3,
        opacity: 0,
        morphSVG: Circle,
        ease: "power2.inOut",
    });
}, [onAnimationComplete])

  return (
    <>
    <div className='absolute w-screen h-screen flex items-center justify-center flex-col top-0 left-0 bg-eduLightBlue z-50' ref={introRef} >
        <div className='relative w-[650px] h-auto flex flex-col'>
            <div className='relative flex justify-start'>
                {lettersOne.map((letter, index) => (
                    <h2 className='uppercase font-body text-[70px] text-white animateTextOne opacity-0 font-light' key={index}>
                        {letter === " " ? "\u00A0" : letter}
                    </h2>
                ))}
            </div>
            <div className='absolute my-[25px] w-[210px] h-[210px] flex justify-center top-[100px] left-[80px]'>
                <Image src={EduIntroLogo} alt={'eduRx-logo'} ref={logoRef} className={'opacity-0 -z-30'} fill />
            </div>
            <div className='relative flex justify-end'>
                {lettersTwo.map((letters, index) => (
                    <h1 className='font-headers text-[80px] text-white animateTextOne opacity-0 tracking-[5px]' key={index}>
                        {letters === " " ? "\u00A0" : letters}
                    </h1>
                ))}
            </div>
        </div>
    </div>
    </>
  );
};

export default Intro