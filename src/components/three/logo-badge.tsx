"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

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

function createRoundedSquareShape(size: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -size / 2;
  const y = -size / 2;

  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + size - radius);
  shape.quadraticCurveTo(x, y + size, x + radius, y + size);
  shape.lineTo(x + size - radius, y + size);
  shape.quadraticCurveTo(x + size, y + size, x + size, y + size - radius);
  shape.lineTo(x + size, y + radius);
  shape.quadraticCurveTo(x + size, y, x + size - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  return shape;
}

function createQuadrantTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#3C2A72";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#C3287D";
  ctx.fillRect(128, 0, 128, 128);
  ctx.fillStyle = "#B9AEE8";
  ctx.fillRect(0, 128, 128, 128);
  ctx.fillStyle = "#B9AEE8";
  ctx.fillRect(128, 128, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function spiralPoints3D(
  turns: number,
  startRadius: number,
  steps: number,
  z: number,
  centerOffsetY: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2 - Math.PI / 2;
    const radius = startRadius * Math.pow(1 - t, 1.15);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle) + centerOffsetY;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

const BADGE_SIZE = 2.2;
const BADGE_DEPTH = 0.18;

function Badge({ spin, tilt }: { spin: boolean; tilt: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const targetTilt = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => {
    const shape = createRoundedSquareShape(BADGE_SIZE, BADGE_SIZE * 0.22);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: BADGE_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 6,
      curveSegments: 24,
    });
    geo.center();
    geo.computeBoundingBox();
    return geo;
  }, []);

  // The bevel extends the geometry beyond the nominal depth, so the true
  // front-face z has to be read from the actual bounding box rather than
  // assumed from BADGE_DEPTH — otherwise the ribbon ends up behind the
  // front face and gets occluded.
  const frontZ = (geometry.boundingBox?.max.z ?? BADGE_DEPTH / 2) + 0.02;

  const texture = useMemo(() => createQuadrantTexture(), []);

  const spiralGeometry = useMemo(() => {
    const points = spiralPoints3D(2, 0.35, 90, frontZ, 0.15);
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 140, 0.03, 8, false);
  }, [frontZ]);

  const smileGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.32, -0.42, frontZ),
      new THREE.Vector3(0, -0.56, frontZ),
      new THREE.Vector3(0.32, -0.42, frontZ),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 40, 0.028, 8, false);
  }, [frontZ]);

  useFrame((state, delta) => {
    if (spin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }

    if (tilt && bodyRef.current) {
      targetTilt.current.x = state.pointer.y * 0.25;
      targetTilt.current.y = state.pointer.x * 0.3;
      bodyRef.current.rotation.x += (targetTilt.current.x - bodyRef.current.rotation.x) * 0.06;
      bodyRef.current.rotation.z += (-targetTilt.current.y - bodyRef.current.rotation.z) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            attach="material-0"
            map={texture}
            roughness={0.15}
            metalness={0.3}
          />
          <meshStandardMaterial attach="material-1" color="#3C2A72" roughness={0.15} metalness={0.3} />
        </mesh>
        <mesh geometry={spiralGeometry}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh geometry={smileGeometry}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

export function LogoBadge3D() {
  const reduced = useReducedMotion();
  const active = !reduced;

  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 4]} intensity={90} color="#e8a8c8" />
      <pointLight position={[-4, -2, 3]} intensity={70} color="#c99b3f" />
      <directionalLight position={[0, 4, 2]} intensity={0.6} color="#ffffff" />

      <Float speed={active ? 1 : 0} floatIntensity={active ? 0.6 : 0} rotationIntensity={0.1}>
        <Badge spin={active} tilt={active} />
      </Float>
    </Canvas>
  );
}
