import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const AudioReactiveSphere = ({ analyser, isPlaying }) => {
  const meshRef = useRef();
  const dataArray = useMemo(() => new Uint8Array(128), []);
  
  useFrame((state) => {
    if (!meshRef.current) return;

    let scale = 1;
    let colorShift = 0;

    if (analyser && isPlaying) {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average bass/low-mid frequency (0-30 range of 128 bins)
      let sum = 0;
      for (let i = 0; i < 30; i++) {
        sum += dataArray[i];
      }
      const average = sum / 30;
      
      // Normalize to a scale factor (e.g., 1.0 to 1.5)
      scale = 1 + (average / 255) * 2.5;
      
      // Color shift based on intensity
      colorShift = average / 255;
    } else {
        // Idle animation
        scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    // Smooth interpolation for scale
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    
    // Rotation
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.002;
    if (isPlaying) {
         meshRef.current.rotation.z += 0.005; // Spin faster when playing
    }

    // Dynamic Color
    const baseColor = new THREE.Color("#10b981"); // Green-500
    const activeColor = new THREE.Color("#34d399"); // Green-400
    meshRef.current.material.color.lerp(isPlaying ? activeColor : baseColor, 0.05);
  });

  return (
    <Icosahedron ref={meshRef} args={[1.5, 4]} position={[0, 0, 0]}>
      <meshBasicMaterial 
        color="#10b981" 
        wireframe 
        transparent 
        opacity={0.8} 
      />
    </Icosahedron>
  );
};

const ReactiveParticles = ({ analyser, isPlaying }) => {
    const pointsRef = useRef();
    // Create initial random positions
    const particlesCount = 1500;
    const positions = useMemo(() => {
        const p = new Float32Array(particlesCount * 3);
        for(let i=0; i<particlesCount; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360); 
            const phi = THREE.MathUtils.randFloatSpread(360); 
            const r = 10 + Math.random() * 20; // Radius
            
            p[i*3] = r * Math.sin(theta) * Math.cos(phi);
            p[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
            p[i*3+2] = r * Math.cos(theta);
        }
        return p;
    }, []);

    const dataArray = useMemo(() => new Uint8Array(128), []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        
        // Rotate the whole cloud
        let rotationSpeed = 0.001;
        if (analyser && isPlaying) {
             analyser.getByteFrequencyData(dataArray);
             // Use high frequencies for speed (approx index 80-120)
             let highSum = 0;
             for(let i=80; i<120; i++) highSum += dataArray[i];
             const highAvg = highSum / 40;
             rotationSpeed += (highAvg / 255) * 0.005;
        }

        pointsRef.current.rotation.y += rotationSpeed;
        pointsRef.current.rotation.x += rotationSpeed * 0.5;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute 
                    attach="attributes-position" 
                    count={particlesCount} 
                    itemSize={3} 
                    array={positions} 
                />
            </bufferGeometry>
            <pointsMaterial 
                size={0.12} 
                color="#4ade80" 
                transparent 
                opacity={0.8} 
                sizeAttenuation={true} 
            />
        </points>
    );
}

const ThreeScene = ({ isPlaying, analyser }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <fog attach="fog" args={['#050505', 5, 25]} />
        <ambientLight intensity={0.2} />
        <Stars radius={50} depth={50} count={2000} factor={3} saturation={0} fade speed={isPlaying ? 1 : 0.2} />
        
        <AudioReactiveSphere isPlaying={isPlaying} analyser={analyser} />
        <ReactiveParticles isPlaying={isPlaying} analyser={analyser} />
        
      </Canvas>
    </div>
  );
};

export default ThreeScene;
