import { MOMENTS } from "@/lib/moments";
import { Reveal } from "@/components/reveal";

export function ExerciseSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
          El ejercicio, en pocas palabras
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          En cada comida, el paciente coloca un pequeño trozo de caucho en la
          punta de la lengua y traga así. Con la repetición, la lengua
          aprende a descansar contra el paladar y, al tragar, los dientes se
          cierran mientras la lengua se mantiene arriba.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        {MOMENTS.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.06}>
            <div className="flex h-full flex-col items-center gap-2 rounded-2xl border border-border bg-card px-3 py-6 text-center shadow-sm">
              <span className="text-3xl">{m.icon}</span>
              <span className="font-heading text-sm font-semibold text-brand-purple-dark">
                {m.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-6 text-center text-sm text-ink-soft">
        La doctora define, paciente por paciente, cuáles de estos momentos
        aplican — el cumplimiento se mide solo contra lo que ella prescribió.
      </Reveal>
    </section>
  );
}
