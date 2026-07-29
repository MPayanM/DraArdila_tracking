"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function DoctorAppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) router.replace("/doctor/login");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) router.replace("/doctor/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/doctor/login");
  }

  if (!session) {
    return <div className="flex flex-1" />;
  }

  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-background">
      <div className="aurora-bg opacity-20" aria-hidden />
      <header className="glass-panel relative z-10 border-b border-border/60">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-2.5">
          <Link href="/doctor" className="flex items-center gap-3">
            <Image
              src="/fono.webp"
              alt="Logo Dra. Sandra Ardila"
              width={52}
              height={52}
              className="rounded-xl shadow-sm"
            />
            <span className="font-heading text-base font-bold text-brand-purple-dark">
              Panel de la doctora
            </span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
