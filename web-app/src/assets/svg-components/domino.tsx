import React, { useRef } from 'react';

interface DominoProps {
    forwardedRefs: {
      circleOne: React.RefObject<SVGPathElement>;
      circleTwo: React.RefObject<SVGGElement>;
      circleThree: React.RefObject<SVGGElement>;
      circleFour: React.RefObject<SVGGElement>;
      circleFive: React.RefObject<SVGGElement>;
      rxOne: React.RefObject<SVGGElement>;
      rxTwo: React.RefObject<SVGGElement>;
    //   hiddenPathOne: React.RefObject<SVGPathElement>;
    };
} 


const Domino: React.FC<DominoProps> = ({forwardedRefs }) => {

const getTransform = () => {
    const xOffset = window.innerWidth / 2 - 65;
    const yOffset = 70;
    return `translate(${xOffset}, ${yOffset})`;
};

  return (
    <>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className='w-full h-[650px] absolute top-0 left-0'
            viewBox={`0 0 ${window.innerWidth} ${document.documentElement.scrollHeight}`}
        >
            <defs>
                <linearGradient id="linear-gradient" x1="12.84" y1="241.87" x2="12.84" y2=".72" gradientTransform="translate(0 242.37) scale(1 -1)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#f8f7f9"/>
                <stop offset="1" stopColor="#e8e6e3"/>
                </linearGradient>
                <linearGradient id="linear-gradient-2" x1="8.3" y1="241.7" x2="17.68" y2="-1.86" gradientTransform="translate(0 242.37) scale(1 -1)" gradientUnits="userSpaceOnUse">
                <stop offset=".06" stopColor="#142738"/>
                <stop offset="1" stopColor="#1f396c"/>
                <stop offset="1" stopColor="#14222a" />
                </linearGradient>
                <linearGradient id="linear-gradient-3" x1="-8.44" y1="189.37" x2="175.74" y2="51.18" gradientTransform="translate(0 242.37) scale(1 -1)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#f8f7f9"/>
                <stop offset="1" stopColor="#e7e5e2"/>
                </linearGradient>
                <linearGradient id="linear-gradient-4" x1="77.54" y1="-1.99" x2="87.03" y2="244.14" gradientTransform="matrix(1,0,0,1,0,0)" xlinkHref="#linear-gradient-2"/>
                <linearGradient id="linear-gradient-5" x1="48.52" y1="228.7" x2="48.52" y2="202.04" gradientTransform="translate(0 242.37) scale(1 -1)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#14222a"/>
                <stop offset="1" stopColor="#1f396c"/>
                </linearGradient>
                <linearGradient id="linear-gradient-6" y1="110.03" y2="83.37" xlinkHref="#linear-gradient-5"/>
                <linearGradient id="linear-gradient-7" x1="82.29" y1="76.26" x2="82.29" y2="49.59" xlinkHref="#linear-gradient-5"/>
                <linearGradient id="linear-gradient-8" x1="116.08" y1="38.48" x2="116.08" y2="11.81" xlinkHref="#linear-gradient-5"/>
                <linearGradient id="linear-gradient-9" y1="38.48" y2="11.81" xlinkHref="#linear-gradient-5"/>
            </defs>
            
            <g id="Layer_1" data-name="Layer 1" transform={getTransform()}>
                <g>
                <path d="m5,1h20.18v240.15H5c-2.49,0-4.5-2.01-4.5-4.5V5.5C.5,3.01,2.51,1,5,1Z" fill="url(#linear-gradient)" stroke="url(#linear-gradient-2)"/>
                <rect x="20.93" y=".5" width="122.72" height="241.15" rx="5" ry="5" fill="url(#linear-gradient-3)" stroke="url(#linear-gradient-4)" stroke-miterlimit="10"/>
                </g>
                <line x1="20.93" y1="113.67" x2="143.64" y2="113.67" fill="none" stroke="#14222a" stroke-miterlimit="10"/>
            </g>
            <g id="Layer_3" data-name="Layer 3" ref={forwardedRefs.circleOne} transform={getTransform()}>
                <circle cx="48.52" cy="27" r="13.33" fill="url(#linear-gradient-5)"/>
            </g>
            <g id="Layer_2" data-name="Layer 2" ref={forwardedRefs.circleTwo} transform={getTransform()}>
                <circle cx="48.52" cy="145.67" r="13.33" fill="url(#linear-gradient-6)"/>
            </g>
            <g id="Layer_4" data-name="Layer 4" ref={forwardedRefs.circleThree} transform={getTransform()}>
                <circle cx="82.29" cy="179.45" r="13.33" fill="url(#linear-gradient-7)"/>
            </g>
            <g id="Layer_5" data-name="Layer 5" ref={forwardedRefs.circleFour} transform={getTransform()}>
                <circle cx="116.08" cy="217.22" r="13.33" fill="url(#linear-gradient-8)"/>
            </g>
            <g id="Layer_6" data-name="Layer 6" ref={forwardedRefs.circleFive} transform={getTransform()}>
                <circle cx="48.52" cy="217.22" r="13.33" fill="url(#linear-gradient-9)" />
            </g>
            <g id="Layer_7" data-name="Layer 7" ref={forwardedRefs.rxOne} transform={getTransform()}>
                <path d="m133.7,130.32l-6.08,9.74,6.05,9.72h-3.58l-4.4-7.06-4.12,7.06h-3.58l6.05-9.72-6.05-9.74h3.58l4.4,7.08,4.14-7.08h3.58Z" fill="#1f396c"/>
            </g>
            <g id="Layer_8" data-name="Layer 8" ref={forwardedRefs.rxTwo} transform={getTransform()}>
                <path d="m122.08,101.73v7.9h-3.19v-19.46h6.72c2.2,0,3.9.55,5.1,1.65,1.19,1.08,1.79,2.46,1.79,4.14,0,1.31-.4,2.48-1.2,3.53-.78,1.05-2,1.73-3.64,2.04l5.15,8.09h-3.89l-4.87-7.9h-1.96Z" fill="#1f396c"/>
                <path d="m122.08,92.66v6.58h3.53c1.21,0,2.12-.29,2.72-.87.6-.58.9-1.38.9-2.41s-.3-1.86-.9-2.44c-.6-.58-1.5-.87-2.72-.87h-3.53Z" fill="#efeeec" stroke="#1f396c" stroke-miterlimit="10"/>
            </g>
        </svg>
    </>
  );
};

export default Domino;