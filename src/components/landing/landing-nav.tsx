"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass-panel">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
        <Link href="/" className="min-w-0 shrink">
          <BrandMark size={40} textClassName="text-base sm:text-lg" />
        </Link>
        <nav className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Link
            href="/paciente"
            className="text-sm font-medium text-ink-soft hover:text-brand-purple"
          >
            Soy paciente
          </Link>
          <Button
            size="sm"
            className="bg-brand-purple px-3 text-white hover:bg-brand-purple/85 sm:px-2.5"
            render={
              <Link href="/doctor/login">
                <span className="sm:hidden">Profesional</span>
                <span className="hidden sm:inline">Acceso profesional</span>
              </Link>
            }
          />
        </nav>
      </div>
    </header>
  );
}
