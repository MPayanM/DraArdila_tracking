"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Routes under /doctor share a persistent header (see doctor/(app)/layout.tsx),
// which handles its own internal content transition. Group them under one key
// here so the header doesn't unmount and re-animate on every inner navigation.
function transitionKey(pathname: string): string {
  if (pathname.startsWith("/doctor") && pathname !== "/doctor/login") {
    return "doctor-app";
  }
  return pathname;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={transitionKey(pathname)}
        initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : -16, scale: reduce ? 1 : 0.985 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
