"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Deliberately excludes brand-purple-dark (#3c2a72): its luminance sits too
// close to the --ink text color, so a blob in that hue drifting behind a
// heading or paragraph can wash the text out instead of reading as background.
const SHARD_COLORS = ["#5b3c8e", "#c3287d", "#c99b3f", "#b9aee8"];

// The readable column (max-w-3xl, ~768px, minus page padding) stays a small
// fraction of the viewport on desktop but swallows nearly the entire width
// on a phone — a fixed exclusion fraction that looked right on desktop left
// almost no protected margin on mobile, where the column IS the viewport.
// So the excluded fraction is computed per-viewport-width, not hardcoded.
function centerSafeFraction(viewportWidthPx: number): number {
  const columnWidthPx = Math.min(viewportWidthPx - 32, 768);
  const raw = columnWidthPx / viewportWidthPx + 0.1;
  return Math.min(0.92, Math.max(0.55, raw));
}

type ShardConfig = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
  distort: number;
  driftSpeed: number;
  driftPhase: number;
  parallaxFactor: number;
  hueBase: number;
  hueSweep: number;
  hueSpeed: number;
  saturation: number;
  lightness: number;
};

function makeShards(
  count: number,
  spread: number,
  depthRange: [number, number],
  opacityScale: number,
  cameraZ: number,
  fovDeg: number
): ShardConfig[] {
  const [near, far] = depthRange;
  const viewportWidthPx = typeof window === "undefined" ? 1440 : window.innerWidth;
  const aspect = typeof window === "undefined" ? 16 / 9 : window.innerWidth / window.innerHeight;
  const tanHalfV = Math.tan((fovDeg * Math.PI) / 180 / 2);
  const safeFraction = centerSafeFraction(viewportWidthPx);

  return Array.from({ length: count }, (_, i) => {
    const z = far + Math.random() * (near - far);
    const depthT = (z - far) / (near - far);

    // Perspective-correct: the screen-space half-width at this shard's own
    // depth, so the excluded center column tracks the same on-screen
    // fraction regardless of how close or far the shard is.
    const distance = cameraZ - z;
    const halfScreenWidth = distance * tanHalfV * aspect;
    const safeHalfWidth = halfScreenWidth * safeFraction;

    const side = Math.random() < 0.5 ? -1 : 1;
    const x = side * (safeHalfWidth + Math.random() * (halfScreenWidth - safeHalfWidth));

    const color = SHARD_COLORS[i % SHARD_COLORS.length];
    const hsl = { h: 0, s: 0, l: 0 };
    new THREE.Color(color).getHSL(hsl);

    return {
      position: [x, (Math.random() - 0.5) * spread * 0.5, z] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: 0.35 + depthT * 0.55 + Math.random() * 0.2,
      color,
      opacity: (0.18 + depthT * 0.2) * opacityScale,
      // Stronger, faster warp than a gentle ambient wobble — the goal is a
      // visibly liquid, morphing surface, not just a soft undulation.
      distort: 0.55 + Math.random() * 0.35,
      driftSpeed: 0.05 + Math.random() * 0.08,
      driftPhase: Math.random() * Math.PI * 2,
      parallaxFactor: 0.15 + depthT * 0.85,
      // Slow iridescent hue cycling, bounded to an arc around the blob's own
      // brand hue so it reads as psychedelic/liquid without drifting into an
      // unrelated, clashing color.
      hueBase: hsl.h,
      hueSweep: 0.12 + Math.random() * 0.06,
      hueSpeed: 0.06 + Math.random() * 0.05,
      saturation: Math.min(1, hsl.s * 1.15),
      lightness: hsl.l,
    };
  });
}

/** Tracks pointer position via a window-level listener rather than r3f's
 * built-in canvas hit-testing, since this canvas sits behind all page
 * content (fixed, -z-10) and would rarely be the hit target itself. */
function usePointerRef() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);
  return pointer;
}

function Shard({
  config,
  active,
  pointer,
}: {
  config: ShardConfig;
  active: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null);
  // High-subdivision icosahedron reads as a smooth, soft blob once wrapped in
  // MeshDistortMaterial — abstract and organic rather than hard-faceted.
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 4), []);
  const hslCursor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh || !active) return;

    mesh.rotation.x += delta * config.driftSpeed * 0.3;
    mesh.rotation.y += delta * config.driftSpeed * 0.45;

    const t = state.clock.elapsedTime;
    const bobble = Math.sin(t * config.driftSpeed + config.driftPhase) * 0.15;
    const breathe = 1 + Math.sin(t * config.driftSpeed * 1.6 + config.driftPhase) * 0.08;
    mesh.scale.setScalar(config.scale * breathe);

    const targetX = config.position[0] + pointer.current.x * config.parallaxFactor * 1.4;
    const targetY =
      config.position[1] + pointer.current.y * config.parallaxFactor * 0.9 + bobble;

    mesh.position.x += (targetX - mesh.position.x) * 0.04;
    mesh.position.y += (targetY - mesh.position.y) * 0.04;

    // Slow iridescent hue cycling, bounded to an arc around the blob's own
    // brand hue (see makeShards) — reads as liquid/psychedelic without
    // drifting into an unrelated, clashing color.
    if (materialRef.current) {
      const hue =
        config.hueBase + Math.sin(t * config.hueSpeed + config.driftPhase) * config.hueSweep;
      hslCursor.setHSL(((hue % 1) + 1) % 1, config.saturation, config.lightness);
      materialRef.current.color.copy(hslCursor);
    }
  });

  return (
    <mesh ref={ref} geometry={geometry} position={config.position} rotation={config.rotation} scale={config.scale}>
      <MeshDistortMaterial
        ref={materialRef}
        color={config.color}
        distort={config.distort}
        speed={active ? config.driftSpeed * 6 : 0}
        roughness={0.2}
        metalness={0.25}
        transparent
        opacity={config.opacity}
      />
    </mesh>
  );
}

function ScrollGroup({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const scrollTarget = useRef(0);

  useFrame(() => {
    const g = group.current;
    if (!g || !active) return;
    scrollTarget.current = window.scrollY * 0.0012;
    g.position.y += (scrollTarget.current - g.position.y) * 0.05;
  });

  return <group ref={group}>{children}</group>;
}

const CAMERA_Z = 6;
const FOV_DEG = 50;

const VARIANT_CONFIG = {
  hero: {
    count: 20,
    spread: 13,
    depthRange: [2, -6] as [number, number],
    opacityScale: 1,
    dpr: [1, 1.75] as [number, number],
  },
  ambient: {
    count: 10,
    spread: 15,
    depthRange: [0, -8] as [number, number],
    opacityScale: 0.55,
    dpr: [1, 1.25] as [number, number],
  },
};

export function DepthField({ variant }: { variant: "hero" | "ambient" }) {
  const reduced = useReducedMotion();
  const active = !reduced;
  const pointer = usePointerRef();
  const config = VARIANT_CONFIG[variant];

  const shards = useMemo(
    () =>
      makeShards(
        config.count,
        config.spread,
        config.depthRange,
        config.opacityScale,
        CAMERA_Z,
        FOV_DEG
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variant]
  );

  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV_DEG }}
      dpr={config.dpr}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 3, 5]} intensity={80} color="#e8a8c8" />
      <pointLight position={[-4, -2, 4]} intensity={60} color="#c99b3f" />
      <directionalLight position={[0, 4, 2]} intensity={0.5} color="#ffffff" />
      <ScrollGroup active={active}>
        {shards.map((s, i) => (
          <Shard key={i} config={s} active={active} pointer={pointer} />
        ))}
      </ScrollGroup>
    </Canvas>
  );
}
