"use client";

import dynamic from "next/dynamic";

const LogoBadge3D = dynamic(() => import("./logo-badge").then((m) => m.LogoBadge3D), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full rounded-[22%] opacity-60 blur-2xl"
      style={{
        background:
          "radial-gradient(circle, var(--brand-magenta), var(--brand-purple) 70%)",
      }}
    />
  ),
});

export function LogoBadgeCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <LogoBadge3D />
    </div>
  );
}
