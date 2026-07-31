"use client";

import { usePathname } from "next/navigation";
import { DepthFieldCanvas } from "./depth-field-canvas";

export function DepthFieldRoot() {
  const pathname = usePathname();
  const variant = pathname === "/" ? "hero" : "ambient";

  return (
    <DepthFieldCanvas
      variant={variant}
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
