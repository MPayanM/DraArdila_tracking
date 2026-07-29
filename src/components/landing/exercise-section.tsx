import { MOMENTS } from "@/lib/moments";
import { Reveal } from "@/components/reveal";

export function ExerciseSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
          El ejercicio, explicado en una frase
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          En cada comida, el paciente mastica y traga con un pequeño trozo de
          caucho en la punta de la lengua. Así se entrena que la lengua
          descanse en el paladar y que, al tragar, los dientes cierren y la
          lengua se mantenga arriba.
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
        La doctora decide cuáles de estos 5 momentos aplican para cada
        paciente, y el cumplimiento se calcula solo contra lo prescrito.
      </Reveal>
    </section>
  );
}
