"use client";

import dynamic from "next/dynamic";

const DepthField = dynamic(() => import("./depth-field").then((m) => m.DepthField), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full opacity-50 blur-3xl"
      style={{
        background:
          "radial-gradient(60% 50% at 30% 20%, var(--brand-magenta), transparent 70%), radial-gradient(50% 45% at 75% 70%, var(--brand-purple), transparent 70%)",
      }}
    />
  ),
});

export function DepthFieldCanvas({
  variant,
  className,
}: {
  variant: "hero" | "ambient";
  className?: string;
}) {
  return (
    <div className={className}>
      <DepthField variant={variant} />
    </div>
  );
}
