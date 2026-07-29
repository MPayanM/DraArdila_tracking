"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Mesh } from "three";

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);
  return reduced;
}

function CoreOrb({ spin }: { spin: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!spin || !meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <Sphere ref={meshRef} args={[1.4, 128, 128]}>
      <MeshDistortMaterial
        color="#5b3c8e"
        attach="material"
        distort={0.42}
        speed={spin ? 1.6 : 0}
        roughness={0.15}
        metalness={0.3}
      />
    </Sphere>
  );
}

function SatelliteOrb({
  position,
  color,
  scale,
  spin,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  spin: boolean;
}) {
  return (
    <Float speed={spin ? 1.4 : 0} floatIntensity={spin ? 1.6 : 0} rotationIntensity={spin ? 0.6 : 0}>
      <Sphere args={[scale, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          distort={0.3}
          speed={spin ? 1.2 : 0}
          roughness={0.2}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </Float>
  );
}

export function HeroOrb() {
  const reduced = useReducedMotion();
  const spin = !reduced;

  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 4]} intensity={90} color="#e8a8c8" />
      <pointLight position={[-4, -2, 3]} intensity={70} color="#c99b3f" />
      <directionalLight position={[0, 4, 2]} intensity={0.6} color="#ffffff" />

      <Float speed={spin ? 1 : 0} floatIntensity={spin ? 0.8 : 0} rotationIntensity={0.15}>
        <CoreOrb spin={spin} />
      </Float>
      <SatelliteOrb position={[1.9, 1.1, -0.6]} color="#c3287d" scale={0.42} spin={spin} />
      <SatelliteOrb position={[-1.7, -1.2, 0.4]} color="#c99b3f" scale={0.3} spin={spin} />
    </Canvas>
  );
}
