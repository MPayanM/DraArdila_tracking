"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";

// Purely perceptual — Next.js client navigations are usually fast, but a
// brief top-of-viewport progress cue makes route changes read as
// intentional and smooth rather than an abrupt cut.
export function RouteProgress() {
  const pathname = usePathname();
  const controls = useAnimationControls();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;

    async function run() {
      setVisible(true);
      controls.set({ width: "0%", opacity: 1 });
      await controls.start({
        width: "70%",
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
      });
      if (cancelled) return;
      await controls.start({
        width: "100%",
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      });
      if (cancelled) return;
      await controls.start({
        opacity: 0,
        transition: { duration: 0.25, delay: 0.1 },
      });
      if (!cancelled) setVisible(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [pathname, controls]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]" aria-hidden>
      <motion.div className="h-full brand-gradient" animate={controls} />
    </div>
  );
}
