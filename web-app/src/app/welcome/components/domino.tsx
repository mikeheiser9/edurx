import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

function useLerpedMouse() {
  const mouse = useThree((state) => state.mouse);
  const lerped = useRef(new THREE.Vector2());
  const previous = useRef(new THREE.Vector2()).current;

  useFrame(() => {
    previous.copy(lerped.current);
    lerped.current.lerp(mouse, 0.1);
  });

  return lerped;
}

const Domino: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 overflow-hidden">
      <Canvas>
        <ambientLight />
        <GLBContent />
      </Canvas>
    </div>
  );
};

const GLBContent: React.FC = () => {
  const dominoRef = useRef<THREE.Object3D>(null);
  const { scene } = useThree();
  const gltf = useGLTF('/models/domino.glb');
  const mouse = useLerpedMouse();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrollPos, setScrollPos] = useState(0);
  const [shouldRotate, setShouldRotate] = useState(true);
  const prevScrollPos = useRef(0);
  
  let startYRotation = useRef(0);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    
    function handleScroll() {
      setScrollPos(window.scrollY);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

useEffect(() => {
  if (dominoRef.current) {
    if (scrollPos === 0) {
      setShouldRotate(false);
      gsap.to(dominoRef.current.rotation, {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'power4.out',
        onComplete: () => {
          setShouldRotate(true);
        },
      });
    } else if (prevScrollPos.current === 0) {
      const targetRotationX = THREE.MathUtils.clamp(
        (mouse.current.y * Math.PI) / -2,
        THREE.MathUtils.degToRad(-80),
        THREE.MathUtils.degToRad(10)
      );
      const targetRotationY = THREE.MathUtils.clamp(
        (mouse.current.x * Math.PI) / 2,
        THREE.MathUtils.degToRad(-20),
        THREE.MathUtils.degToRad(80)
      );
      
      setShouldRotate(false);
      gsap.to(dominoRef.current.rotation, {
        x: targetRotationX,
        y: targetRotationY,
        duration: 1.5,
        ease: 'power4.out',
        onComplete: () => {
          setShouldRotate(true);
        },
      });
    }
    
    prevScrollPos.current = scrollPos;
  }
}, [scrollPos]);

  useEffect(() => {
    const model = gltf.scene;  

    if (windowWidth <= 1600) {
      model.scale.set(0.65, 0.65, 0.65);
      model.position.set(0, 0.35, 0);
    }

    dominoRef.current = model;
    scene.add(model);

    const movementPercentage = 0.5;
    const movementValue = windowWidth * movementPercentage;

    const tl = gsap.timeline({
      onUpdate: () => {
        startYRotation.current = model.rotation.y;
      },
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
    
    tl.to(model.rotation, { y: Math.PI * 2 })
    tl.to(model.position, { x: movementValue, duration: '33%' }, "250px")
    tl.to(model.position, { x: -movementValue, duration: '33%' }, "<")
    tl.to(model.position, { x: 0, duration: '33%' }, "<");

    return () => {
      scene.remove(model);
    };
  }, [gltf, scene, windowWidth]);

  useFrame(() => {
    if (dominoRef.current && shouldRotate) {
      const maxYRotation = scrollPos > 0 ? THREE.MathUtils.degToRad(80) : THREE.MathUtils.degToRad(20);
      const maxXRotation = scrollPos > 0 ? THREE.MathUtils.degToRad(80) : THREE.MathUtils.degToRad(10);

      const offsetYRotation = THREE.MathUtils.clamp(
        (mouse.current.x * Math.PI) / 2,
        -maxYRotation,
        maxYRotation
      );
      const offsetXRotation = THREE.MathUtils.clamp(
        (mouse.current.y * Math.PI) / -2,
        -maxXRotation,
        maxXRotation
      );

      dominoRef.current.rotation.y = startYRotation.current + offsetYRotation;
      dominoRef.current.rotation.x = offsetXRotation;
    }
  });

  return <primitive ref={dominoRef} object={gltf.scene} />;
};

export default Domino;
