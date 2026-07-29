"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass-panel">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/fono.webp"
            alt="Logo Dra. Sandra Ardila"
            width={34}
            height={34}
            className="rounded-lg shadow-sm"
            priority
          />
          <span className="font-heading text-sm font-bold text-brand-purple-dark">
            Sandra Ardila
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/paciente">Soy paciente</Link>}
          />
          <Button
            size="sm"
            className="brand-gradient text-white hover:opacity-90"
            render={<Link href="/doctor/login">Acceso profesional</Link>}
          />
        </nav>
      </div>
    </header>
  );
}
