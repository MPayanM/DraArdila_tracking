"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PatientIdentify({
  onIdentify,
}: {
  onIdentify: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onIdentify(name.trim());
    } catch {
      toast.error("No se pudo conectar. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="aurora-bg opacity-60" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-6 flex flex-col items-center gap-3 text-center"
      >
        <Image
          src="/fono.webp"
          alt="Logo Dra. Sandra Ardila"
          width={72}
          height={72}
          className="rounded-2xl shadow-sm"
          priority
        />
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">
            Ejercicio de masticación y deglución
          </h1>
          <p className="text-sm text-ink-soft">Dra. Sandra Ardila · Fonoaudióloga</p>
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
              Ingresa tu nombre para continuar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="patient-name">Nombre completo</Label>
                <Input
                  id="patient-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Ana María Gómez"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={!name.trim() || loading}
                className="brand-gradient text-white hover:opacity-90"
              >
                {loading ? "Cargando..." : "Continuar"}
              </Button>
              <p className="text-center text-xs leading-relaxed text-ink-soft">
                Tu nombre se usa solo para identificar tus registros de
                ejercicio. No se requiere contraseña.
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <div className="relative z-10 mt-6 flex gap-4 text-xs text-ink-soft">
        <Link href="/" className="underline-offset-2 hover:underline">
          ← Volver al inicio
        </Link>
        <Link href="/doctor/login" className="underline-offset-2 hover:underline">
          Acceso para la doctora
        </Link>
      </div>
    </div>
  );
}
