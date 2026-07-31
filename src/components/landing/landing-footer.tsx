import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <BrandMark size={56} textClassName="text-xl" />
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
