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

  let startYRotation = 0;

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const model = gltf.scene;

    if (windowWidth <= 1600) {
      model.scale.set(0.65, 0.65, 0.65);
      model.position.set(0, 0.35, 0);
    }

    dominoRef.current = model;
    scene.add(model);

    // GSAP scroll-triggered animation
    gsap.to(model.rotation, {
      onUpdate: () => {
        startYRotation = model.rotation.y;
      },
      y: Math.PI * 2,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    return () => {
      scene.remove(model);
    };
  }, [gltf, scene, windowWidth]);

  useFrame(() => {
    if (dominoRef.current) {
      const maxYRotation = THREE.MathUtils.degToRad(80);
      const maxXRotation = THREE.MathUtils.degToRad(80);
      const offsetYRotation = THREE.MathUtils.clamp((mouse.current.x * Math.PI) / 10, -maxYRotation, maxYRotation);
      const offsetXRotation = THREE.MathUtils.clamp((mouse.current.y * Math.PI) / -10, -maxXRotation, maxXRotation);
      
      dominoRef.current.rotation.y = startYRotation + offsetYRotation;
      dominoRef.current.rotation.x = offsetXRotation;
    }
  });

  return <primitive ref={dominoRef} object={gltf.scene} />;
};

export default Domino;
