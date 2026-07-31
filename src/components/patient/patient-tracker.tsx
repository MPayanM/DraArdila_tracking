"use client";

import { useEffect, useId, useMemo, useState } from "react";
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
import { BrandIcon } from "@/components/brand-mark";
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

  const doneToday = MOMENTS.filter((m) => drafts[m.id].done).length;

  return (
    <div className="relative isolate flex-1 overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-3"
        >
          <Link href="/" className="flex items-center gap-3">
            <BrandIcon size={56} className="drop-shadow-md" />
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="flex flex-col gap-6 lg:order-1">
            <Reveal delay={0.08}>
              <Card className="glass-panel rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-medium text-ink">
                      Registrar ejercicio
                    </p>
                    <p className="text-xs text-ink-soft">
                      {doneToday} de {MOMENTS.length} momentos hoy
                    </p>
                  </div>
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
                          <Label
                            htmlFor={`moment-${m.id}`}
                            className="inline-flex items-center gap-1.5 font-heading font-semibold"
                          >
                            <m.icon className="h-4 w-4 text-brand-purple" strokeWidth={1.75} aria-hidden />
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

            <Reveal delay={0.2}>
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
                            <Badge
                              variant="secondary"
                              className="bg-accent text-accent-foreground"
                            >
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

          <Reveal delay={0.02} className="lg:sticky lg:top-6 lg:order-2">
            <Card className="glass-panel rounded-3xl">
              <CardHeader>
                <p className="font-display text-lg font-medium text-ink">
                  Tu cumplimiento
                </p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around lg:flex-col">
                <ComplianceRing value={compliance7} label="Últimos 7 días" size={132} />
                <ComplianceRing value={compliance30} label="Últimos 30 días" size={104} />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function ComplianceRing({
  value,
  label,
  size = 120,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const gradientId = useId();
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand-magenta)" />
              <stop offset="100%" stopColor="var(--brand-purple)" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            className="stroke-accent"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            stroke={`url(#${gradientId})`}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (value / 100) * circumference,
            }}
            transition={{ duration: reduce ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl font-semibold text-brand-purple-dark">
            <AnimatedNumber value={value} suffix="%" />
          </span>
        </div>
      </div>
      <span className="text-xs text-ink-soft">{label}</span>
    </div>
  );
}
