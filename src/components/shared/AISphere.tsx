import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      const time = state.clock.elapsedTime;
      sphereRef.current.rotation.x = time * 0.2;
      sphereRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.4}>
        <MeshDistortMaterial
          color="#3b82f6"
          emissive="#60a5fa"
          emissiveIntensity={0.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.5}
          speed={3}
        />
      </Sphere>
    </Float>
  );
}

export function AISphere() {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8b5cf6" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
        <Environment preset="studio" />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}
