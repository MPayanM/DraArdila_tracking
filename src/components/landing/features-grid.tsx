"use client";

import {
  BarChart3,
  BellRing,
  CalendarClock,
  Download,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/reveal";

const FEATURES = [
  {
    icon: SlidersHorizontal,
    title: "Prescripción por paciente",
    description:
      "Cada paciente tiene sus propios momentos requeridos, así que el cumplimiento nunca se mide contra un estándar genérico.",
  },
  {
    icon: CalendarClock,
    title: "Registro con fecha pasada",
    description:
      "Si el paciente olvida registrar un día, puede completarlo después sin perder el histórico real.",
  },
  {
    icon: BellRing,
    title: "Pacientes nuevos, de un vistazo",
    description:
      "Un panel simple muestra quién se unió en los últimos 7 días, sin tener que revisar toda la lista.",
  },
  {
    icon: Download,
    title: "Exportación a CSV",
    description:
      "El detalle completo de fecha, momento y alimento, listo para anexar a la historia clínica.",
  },
  {
    icon: Smartphone,
    title: "Sin instalar nada",
    description:
      "Funciona como app web desde el celular del paciente y se agrega a la pantalla de inicio como un ícono más.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso profesional protegido",
    description:
      "El panel clínico requiere inicio de sesión; el paciente solo necesita su nombre.",
  },
  {
    icon: BarChart3,
    title: "Reporte semanal y acumulado",
    description:
      "El cumplimiento se organiza por semana y muestra el acumulado del tratamiento, para ver el avance real y no solo una foto de los últimos días.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
          Pensado para el día a día del consultorio
        </h2>
        <p className="mt-4 text-lg text-ink-soft">
          Cada detalle resuelve un problema real de seguimiento clínico.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} delay={(i % 3) * 0.08}>
            <motion.div
              whileHover={{ y: -5, scale: 1.015 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-brand-magenta/40 hover:shadow-lg"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand-purple transition-colors group-hover:bg-brand-magenta group-hover:text-white">
                <feature.icon className="size-5" strokeWidth={2} />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-brand-purple-dark">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {feature.description}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
