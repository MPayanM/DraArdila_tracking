"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/reveal";
import { AnimatedNumber } from "@/components/animated-number";
import { MOMENTS, momentLabel, todayISO, type Moment } from "@/lib/moments";
import {
  addEntry,
  computeCompliance,
  deleteEntry,
  getEntries,
  type Entry,
  type Patient,
} from "@/lib/data";

export function PatientTracker({
  patient,
  onSwitchPatient,
}: {
  patient: Patient;
  onSwitchPatient: () => void;
}) {
  const today = todayISO();
  const [date, setDate] = useState(today);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [savingMoment, setSavingMoment] = useState<Moment | null>(null);
  const [drafts, setDrafts] = useState<Record<Moment, { done: boolean; food: string }>>(
    () => emptyDrafts()
  );

  function emptyDrafts() {
    return Object.fromEntries(
      MOMENTS.map((m) => [m.id, { done: false, food: "" }])
    ) as Record<Moment, { done: boolean; food: string }>;
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.id]);

  useEffect(() => {
    const next = emptyDrafts();
    for (const e of entries) {
      if (e.date === date) {
        next[e.moment] = { done: true, food: e.food };
      }
    }
    setDrafts(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, entries]);

  async function refresh() {
    try {
      const next = await getEntries(patient.id);
      setEntries(next);
    } catch {
      toast.error("No se pudieron cargar tus registros");
    } finally {
      setLoadingEntries(false);
    }
  }

  async function saveMoment(moment: Moment) {
    const draft = drafts[moment];
    const existing = entries.find((e) => e.date === date && e.moment === moment);

    setSavingMoment(moment);
    try {
      if (!draft.done) {
        if (existing) {
          await deleteEntry(existing.id);
          await refresh();
          toast.success(`${momentLabel(moment)} eliminado para esa fecha`);
        }
        return;
      }

      if (!draft.food.trim()) {
        toast.error("Escribe qué alimento comiste antes de guardar");
        return;
      }

      await addEntry({
        patientId: patient.id,
        date,
        moment,
        food: draft.food.trim(),
      });
      await refresh();
      toast.success(`${momentLabel(moment)} guardado`);
    } catch {
      toast.error("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSavingMoment(null);
    }
  }

  async function handleDelete(entry: Entry) {
    try {
      await deleteEntry(entry.id);
      await refresh();
      toast.success("Registro eliminado");
    } catch {
      toast.error("No se pudo eliminar. Intenta de nuevo.");
    }
  }

  const compliance7 = useMemo(
    () => computeCompliance(patient, entries, 7),
    [entries, patient]
  );
  const compliance30 = useMemo(
    () => computeCompliance(patient, entries, 30),
    [entries, patient]
  );

  const history = useMemo(
    () =>
      [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [entries]
  );

  return (
    <div className="relative isolate flex-1 overflow-hidden">
      <div className="aurora-bg opacity-30" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-3"
        >
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/fono.webp"
              alt="Logo Dra. Sandra Ardila"
              width={84}
              height={84}
              className="rounded-2xl shadow-md"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Hola,
              </p>
              <h1 className="font-display text-2xl font-medium text-ink">
                {patient.name}
              </h1>
            </div>
          </Link>
          <Button variant="ghost" size="sm" onClick={onSwitchPatient}>
            No soy {patient.name.split(" ")[0]}
          </Button>
        </motion.header>

        <Reveal delay={0.05}>
          <Card className="glass-panel rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <p className="font-display text-lg font-medium text-ink">
                Tu cumplimiento
              </p>
            </CardHeader>
            <CardContent className="flex gap-6">
              <ComplianceStat label="Últimos 7 días" value={compliance7} />
              <ComplianceStat label="Últimos 30 días" value={compliance30} />
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.12}>
          <Card className="glass-panel rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <p className="font-display text-lg font-medium text-ink">
                Registrar ejercicio
              </p>
              <Input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-auto"
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {MOMENTS.map((m, i) => {
                const draft = drafts[m.id];
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.15 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -2 }}
                    className={`flex flex-col gap-2 rounded-2xl border p-3 transition-colors sm:flex-row sm:items-center ${
                      draft.done
                        ? "border-brand-magenta/30 bg-accent/60"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex min-w-[170px] items-center gap-2">
                      <Checkbox
                        id={`moment-${m.id}`}
                        checked={draft.done}
                        onCheckedChange={(checked) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [m.id]: { ...prev[m.id], done: checked === true },
                          }))
                        }
                      />
                      <Label htmlFor={`moment-${m.id}`} className="font-heading font-semibold">
                        <span className="mr-1">{m.icon}</span>
                        {m.label}
                      </Label>
                    </div>
                    <Input
                      placeholder="¿Qué comiste?"
                      value={draft.food}
                      disabled={!draft.done}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [m.id]: { ...prev[m.id], food: e.target.value },
                        }))
                      }
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={savingMoment === m.id}
                      onClick={() => saveMoment(m.id)}
                    >
                      {savingMoment === m.id ? "Guardando..." : "Guardar"}
                    </Button>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.18}>
          <Card className="glass-panel rounded-3xl">
            <CardHeader>
              <p className="font-display text-lg font-medium text-ink">Historial</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {loadingEntries && (
                <p className="py-6 text-center text-sm text-ink-soft">Cargando...</p>
              )}
              {!loadingEntries && history.length === 0 && (
                <p className="py-6 text-center text-sm text-ink-soft">
                  Aún no tienes registros.
                </p>
              )}
              {history.map((entry, i) => (
                <div key={entry.id}>
                  {i > 0 && <Separator className="my-2" />}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-accent text-accent-foreground">
                          {momentLabel(entry.moment)}
                        </Badge>
                        <span className="text-xs text-ink-soft">{entry.date}</span>
                      </div>
                      <p className="text-sm">{entry.food}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-ink-soft hover:text-brand-magenta"
                      onClick={() => handleDelete(entry)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

function ComplianceStat({ label, value }: { label: string; value: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-ink-soft">{label}</span>
        <span className="font-display text-base font-semibold text-brand-purple-dark">
          <AnimatedNumber value={value} suffix="%" />
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
        <motion.div
          className="h-full brand-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
