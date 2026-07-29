"use client";

import dynamic from "next/dynamic";

const HeroOrb = dynamic(() => import("./hero-orb").then((m) => m.HeroOrb), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full rounded-full opacity-60 blur-2xl"
      style={{
        background:
          "radial-gradient(circle, var(--brand-magenta), var(--brand-purple) 70%)",
      }}
    />
  ),
});

export function HeroOrbCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <HeroOrb />
    </div>
  );
}
