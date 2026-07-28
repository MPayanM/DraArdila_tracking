"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MOMENTS, momentLabel, todayISO, type Moment } from "@/lib/moments";
import {
  addEntry,
  computeCompliance,
  deleteEntry,
  getEntries,
  type Entry,
  type Patient,
} from "@/lib/local-store";

export function PatientTracker({
  patient,
  onSwitchPatient,
}: {
  patient: Patient;
  onSwitchPatient: () => void;
}) {
  const today = todayISO();
  const [date, setDate] = useState(today);
  const [entries, setEntries] = useState<Entry[]>(() => getEntries(patient.id));
  const [drafts, setDrafts] = useState<Record<Moment, { done: boolean; food: string }>>(
    () => emptyDrafts()
  );

  function emptyDrafts() {
    return Object.fromEntries(
      MOMENTS.map((m) => [m.id, { done: false, food: "" }])
    ) as Record<Moment, { done: boolean; food: string }>;
  }

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

  function refresh() {
    setEntries(getEntries(patient.id));
  }

  function saveMoment(moment: Moment) {
    const draft = drafts[moment];
    const existing = entries.find((e) => e.date === date && e.moment === moment);

    if (!draft.done) {
      if (existing) {
        deleteEntry(existing.id);
        refresh();
        toast.success(`${momentLabel(moment)} eliminado para esa fecha`);
      }
      return;
    }

    if (!draft.food.trim()) {
      toast.error("Escribe qué alimento comiste antes de guardar");
      return;
    }

    addEntry({
      patientId: patient.id,
      date,
      moment,
      food: draft.food.trim(),
    });
    refresh();
    toast.success(`${momentLabel(moment)} guardado`);
  }

  function handleDelete(entry: Entry) {
    deleteEntry(entry.id);
    refresh();
    toast.success("Registro eliminado");
  }

  const compliance7 = useMemo(() => computeCompliance(patient, 7), [entries, patient]);
  const compliance30 = useMemo(() => computeCompliance(patient, 30), [entries, patient]);

  const history = useMemo(
    () =>
      [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [entries]
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/fono.webp"
            alt="Logo Dra. Sandra Ardila"
            width={44}
            height={44}
            className="rounded-xl shadow-sm"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Hola,
            </p>
            <h1 className="font-heading text-lg font-bold text-brand-purple-dark">
              {patient.name}
            </h1>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onSwitchPatient}>
          No soy {patient.name.split(" ")[0]}
        </Button>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
            Tu cumplimiento
          </p>
        </CardHeader>
        <CardContent className="flex gap-6">
          <ComplianceStat label="Últimos 7 días" value={compliance7} />
          <ComplianceStat label="Últimos 30 días" value={compliance30} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
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
          {MOMENTS.map((m) => {
            const draft = drafts[m.id];
            return (
              <div
                key={m.id}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center"
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
                <Button size="sm" variant="outline" onClick={() => saveMoment(m.id)}>
                  Guardar
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
            Historial
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {history.length === 0 && (
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
    </div>
  );
}

function ComplianceStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-ink-soft">{label}</span>
        <span className="font-heading text-sm font-bold text-brand-purple-dark">
          {value}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
        <div className="h-full brand-gradient" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
