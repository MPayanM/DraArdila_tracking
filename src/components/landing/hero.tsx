"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-brand-purple">
            Fonoaudiología clínica · Terapia miofuncional
          </span>

          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-medium text-ink sm:text-5xl lg:text-6xl">
            Saber si el ejercicio se está cumpliendo,{" "}
            <span className="text-gradient italic">sin tener que preguntar.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Una herramienta pensada para el consultorio: prescribes el
            ejercicio de masticación y deglución para cada paciente y
            consultas su cumplimiento cuando quieras, sin planillas ni
            llamadas de seguimiento.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-brand-purple h-12 px-6 text-base text-white hover:bg-brand-purple/85"
              render={<Link href="/doctor/login">Acceso profesional</Link>}
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
              render={<Link href="/paciente">Soy paciente</Link>}
            />
          </div>

          <p className="mt-6 text-sm text-ink-soft">
            Desarrollada junto con la Dra. Sandra Ardila, a partir de un
            protocolo que ya usa con sus pacientes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
