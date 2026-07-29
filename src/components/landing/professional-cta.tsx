import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function ProfessionalCta() {
  return (
    <section className="relative isolate mx-4 my-8 overflow-hidden rounded-[2.5rem] sm:mx-6">
      <div className="aurora-bg" aria-hidden>
        <span className="aurora-blob" />
      </div>
      <div className="relative z-10 bg-ink/90 px-6 py-16 text-center sm:px-16 sm:py-20">
        <Reveal>
          <h2 className="font-display text-3xl font-medium text-white sm:text-4xl">
            ¿Eres fonoaudióloga o fonoaudiólogo?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            Esta plataforma nació de un consultorio real. Si te gustaría
            ofrecerla a tus propios pacientes, hablemos.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 bg-white px-6 text-base text-ink hover:bg-white/90"
              render={<Link href="/doctor/login">Acceso para profesionales</Link>}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
