"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

export function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const reduce = useReducedMotion();
  const prevValue = useRef(value);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(prevValue.current, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span>
      {reduce ? value : display}
      {suffix}
    </span>
  );
}
