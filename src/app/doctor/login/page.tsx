"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeroOrbCanvas } from "@/components/three/hero-orb-canvas";
import { BrandIcon } from "@/components/brand-mark";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/doctor");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Credenciales incorrectas");
      return;
    }
    router.replace("/doctor");
  }

  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-14">
      <div className="aurora-bg opacity-80" aria-hidden>
        <span className="aurora-blob" />
      </div>

      <div
        className="pointer-events-none absolute -left-24 -top-10 z-0 h-[26rem] w-[26rem] opacity-40 blur-[2px] sm:opacity-55 lg:-left-10"
        aria-hidden
      >
        <HeroOrbCanvas className="h-full w-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-6 flex flex-col items-center gap-4 text-center"
      >
        <BrandIcon size={96} className="drop-shadow-lg" />
        <div>
          <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">
            Panel de la doctora
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Acceso exclusivo para Dra. Sandra Ardila
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <Card className="border-border glass-panel">
          <CardHeader>
            <p className="text-sm font-semibold text-brand-purple-dark">
              Inicia sesión
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="brand-gradient text-white hover:opacity-90"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Link
        href="/"
        className="relative z-10 mt-6 text-xs text-ink-soft underline-offset-2 hover:underline"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
