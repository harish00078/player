import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const FloatingParticles = ({ isPlaying }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.005;
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.002;
        
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;

        if (isPlaying) {
             meshRef.current.material.color.set('#10b981'); 
             meshRef.current.material.opacity = 0.15;
        } else {
             meshRef.current.material.color.set('#4b5563'); 
             meshRef.current.material.opacity = 0.08;
        }
    }
  });

  return (
    <points ref={meshRef}>
      <sphereGeometry args={[18, 32, 32]} />
      <pointsMaterial 
        color="#4b5563" 
        size={0.02} 
        transparent
        opacity={0.08}
        sizeAttenuation={true} 
      />
    </points>
  );
};

const ThreeScene = ({ isPlaying }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <fog attach="fog" args={['#050505', 5, 20]} />
        <ambientLight intensity={0.05} />
        <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={0.2} />
        <FloatingParticles isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;