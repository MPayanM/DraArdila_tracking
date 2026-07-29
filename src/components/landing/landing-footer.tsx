import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <Image
          src="/fono.webp"
          alt="Logo Dra. Sandra Ardila"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <p className="text-sm font-semibold text-brand-purple-dark">
          Dra. Sandra Ardila · Fonoaudióloga
        </p>
        <p className="max-w-md text-xs leading-relaxed text-ink-soft">
          Los datos de salud registrados aquí se manejan conforme a la Ley
          1581 de 2012 (protección de datos personales, Colombia).
        </p>
        <div className="flex gap-4 text-xs text-ink-soft">
          <Link href="/paciente" className="hover:text-brand-purple hover:underline">
            Soy paciente
          </Link>
          <Link href="/doctor/login" className="hover:text-brand-purple hover:underline">
            Acceso profesional
          </Link>
        </div>
      </div>
    </footer>
  );
}
