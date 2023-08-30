import React, { createContext, useContext, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MotionPathHelper } from 'gsap/MotionPathHelper'
import { TextPlugin } from 'gsap/TextPlugin';

// Register the plugins
gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, DrawSVGPlugin, MotionPathPlugin, TextPlugin, MotionPathHelper);

interface AnimationContextType {
  animations: Array<gsap.core.Animation>;
  registerAnimation: (animation: gsap.core.Animation) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [animations, setAnimations] = useState<Array<gsap.core.Animation>>([]);

  const registerAnimation = (animation: gsap.core.Animation) => {
    setAnimations(prev => [...prev, animation]);
  };

  return (
    <AnimationContext.Provider value={{ animations, registerAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
};
