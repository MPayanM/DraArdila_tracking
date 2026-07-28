"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOMENTS, momentLabel, type Moment } from "@/lib/moments";
import {
  computeCompliance,
  getEntries,
  getPatient,
  updatePatient,
  type Entry,
  type Patient,
} from "@/lib/data";
import { downloadCSV, entriesToCSV } from "@/lib/csv";

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const patientId = params.id;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiredMoments, setRequiredMoments] = useState<Moment[]>([]);
  const [treatmentEndDate, setTreatmentEndDate] = useState("");
  const [savingMoments, setSavingMoments] = useState(false);
  const [savingEndDate, setSavingEndDate] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  async function load() {
    setLoading(true);
    try {
      const [p, e] = await Promise.all([getPatient(patientId), getEntries(patientId)]);
      if (!p) {
        toast.error("Paciente no encontrado");
        router.replace("/doctor");
        return;
      }
      setPatient(p);
      setEntries(e);
      setRequiredMoments(p.requiredMoments);
      setTreatmentEndDate(p.treatmentEndDate ?? "");
    } catch {
      toast.error("No se pudo cargar el paciente");
    } finally {
      setLoading(false);
    }
  }

  async function saveRequiredMoments() {
    setSavingMoments(true);
    try {
      const updated = await updatePatient(patientId, { requiredMoments });
      setPatient(updated);
      toast.success("Momentos prescritos actualizados");
    } catch {
      toast.error("No se pudo guardar");
    } finally {
      setSavingMoments(false);
    }
  }

  async function saveTreatmentEndDate() {
    setSavingEndDate(true);
    try {
      const updated = await updatePatient(patientId, {
        treatmentEndDate: treatmentEndDate || null,
      });
      setPatient(updated);
      toast.success("Fecha de tratamiento actualizada");
    } catch {
      toast.error("No se pudo guardar");
    } finally {
      setSavingEndDate(false);
    }
  }

  function handleExportCSV() {
    if (!patient) return;
    downloadCSV(`${patient.name.replace(/\s+/g, "_")}.csv`, entriesToCSV(entries));
  }

  const compliance7 = useMemo(
    () => (patient ? computeCompliance(patient, entries, 7) : 0),
    [patient, entries]
  );
  const compliance30 = useMemo(
    () => (patient ? computeCompliance(patient, entries, 30) : 0),
    [patient, entries]
  );

  if (loading || !patient) {
    return <p className="py-10 text-center text-sm text-ink-soft">Cargando...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/doctor" className="text-sm text-brand-purple hover:underline">
          ← Volver a pacientes
        </Link>
        <h1 className="mt-1 font-heading text-2xl font-bold text-brand-purple-dark">
          {patient.name}
        </h1>
        {(patient.phone || patient.email) && (
          <p className="text-sm text-ink-soft">
            {[patient.phone, patient.email].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
            Cumplimiento
          </p>
        </CardHeader>
        <CardContent className="flex gap-8">
          <div>
            <p className="text-xs text-ink-soft">Últimos 7 días</p>
            <p className="font-heading text-2xl font-bold text-brand-purple-dark">
              {compliance7}%
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-soft">Últimos 30 días</p>
            <p className="font-heading text-2xl font-bold text-brand-purple-dark">
              {compliance30}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
            Momentos prescritos
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            {MOMENTS.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <Checkbox
                  id={`req-${m.id}`}
                  checked={requiredMoments.includes(m.id)}
                  onCheckedChange={(checked) =>
                    setRequiredMoments((prev) =>
                      checked === true
                        ? [...prev, m.id]
                        : prev.filter((id) => id !== m.id)
                    )
                  }
                />
                <Label htmlFor={`req-${m.id}`}>
                  <span className="mr-1">{m.icon}</span>
                  {m.label}
                </Label>
              </div>
            ))}
          </div>
          <div>
            <Button
              size="sm"
              variant="outline"
              disabled={savingMoments}
              onClick={saveRequiredMoments}
            >
              {savingMoments ? "Guardando..." : "Guardar momentos"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
            Fecha de fin de tratamiento (opcional)
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="end-date">Fecha</Label>
            <Input
              id="end-date"
              type="date"
              value={treatmentEndDate}
              onChange={(e) => setTreatmentEndDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={savingEndDate}
            onClick={saveTreatmentEndDate}
          >
            {savingEndDate ? "Guardando..." : "Guardar fecha"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
            Registro detallado
          </p>
          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          {entries.length === 0 && (
            <p className="py-6 text-center text-sm text-ink-soft">
              Este paciente aún no tiene registros.
            </p>
          )}
          {entries.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Momento</TableHead>
                  <TableHead>Alimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{momentLabel(entry.moment)}</TableCell>
                    <TableCell>{entry.food}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
