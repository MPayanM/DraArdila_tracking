"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroOrbCanvas } from "@/components/three/hero-orb-canvas";

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden">
      <motion.div className="aurora-bg" style={{ y: auroraY }} aria-hidden>
        <span className="aurora-blob" />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-brand-purple">
            Fonoaudiología clínica · Terapia miofuncional
          </span>

          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-medium text-ink sm:text-5xl lg:text-6xl">
            La adherencia terapéutica,{" "}
            <span className="text-gradient italic">por fin visible.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Una plataforma clínica para prescribir el ejercicio de masticación
            y deglución y ver, en tiempo real, si cada paciente lo está
            cumpliendo. Sin planillas, sin llamadas de seguimiento y sin
            tener que adivinar.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="brand-gradient h-12 px-6 text-base text-white hover:opacity-90"
              render={<Link href="/doctor/login">Acceso para profesionales</Link>}
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
              render={<Link href="/paciente">Soy paciente</Link>}
            />
          </div>

          <p className="mt-6 text-sm text-ink-soft">
            Diseñado junto a la Dra. Sandra Ardila a partir de un protocolo
            clínico en uso real con pacientes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-2xl lg:max-w-none"
        >
          <HeroOrbCanvas className="h-full w-full" />
        </motion.div>
      </div>
    </section>
  );
}
