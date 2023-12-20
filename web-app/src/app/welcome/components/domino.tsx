import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
      <Canvas style={{ position: 'relative', zIndex: 10 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[0, 20, 5]} intensity={1} castShadow />
        {/* <pointLight position={[10, 10, 10]} intensity={1} /> */}
        <spotLight position={[10, 15, 10]} angle={0.3} />
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
  } else if (windowWidth >= 1601) {
    model.scale.set(0.45, 0.45, 0.45);
    model.position.set(0, 0.25, 0);
  }

  dominoRef.current = model;
  scene.add(model);

  const movementPercentage = 0.5;
  const movementValue = windowWidth * movementPercentage;
  const startX = model.position.x;

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
  
  tl.to(model.rotation, { y: Math.PI * 2, duration: 1, ease: 'power1.inOut' })

  const tlEnd = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: '97% bottom',
      end: 'bottom bottom',
      scrub: 4
    }
  });

  tlEnd.to(dominoRef.current.position, {
    y: dominoRef.current.position.y - 3,
    duration: 20,
    ease: 'power4.out'
  });

  tlEnd.to(dominoRef.current.scale, {
    x: 0.25,
    y: 0.25,
    z: 0.25,
    duration: 20,
    ease: 'power4.out'
  }, "<");  
  return () => {
    scene.remove(model);
  };
}, [gltf, scene, windowWidth]);

useEffect(() => {
  if (dominoRef.current) {
    const mt = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    mt
      .to(dominoRef.current.position, { x: -5, duration: 6, ease: 'power1.inOut' })
      .to(dominoRef.current.position, { x: 5, duration: 6, ease: 'power1.inOut' })
      .to(dominoRef.current.position, { x: 0, duration: 6, ease: 'power1.inOut' });
  }
}, [dominoRef]);

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
