"use client";

import { ClipboardCheck, LineChart, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    icon: UserRound,
    title: "La doctora prescribe",
    description:
      "Agrega al paciente y define, desde el primer momento, qué comidas debe cumplir — no todos necesitan las 5.",
  },
  {
    icon: ClipboardCheck,
    title: "El paciente registra",
    description:
      "Sin contraseña: escribe su nombre y registra cada comida con el alimento, incluso si fue un día anterior.",
  },
  {
    icon: LineChart,
    title: "La doctora hace seguimiento",
    description:
      "La doctora revisa el cumplimiento semana a semana y el acumulado del tratamiento, sin tener que pedir el dato.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative bg-card/60 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
            Cómo funciona
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5, scale: 1.015 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-7 shadow-sm hover:shadow-lg"
              >
                <span className="font-display text-sm text-brand-magenta">
                  0{i + 1}
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl brand-gradient text-white">
                  <step.icon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-brand-purple-dark">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
