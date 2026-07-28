"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toLocalISODate } from "@/lib/moments";
import {
  addPatientManual,
  computeCompliance,
  deletePatient,
  getAllPatients,
  getEntriesSince,
  type Entry,
  type Patient,
} from "@/lib/data";

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toLocalISODate(d);
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [p, e] = await Promise.all([
        getAllPatients(),
        getEntriesSince(daysAgoISO(30)),
      ]);
      setPatients(p);
      setEntries(e);
    } catch {
      toast.error("No se pudo cargar la información");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAddPatient(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      await addPatientManual({ name, phone, email });
      setName("");
      setPhone("");
      setEmail("");
      toast.success("Paciente agregado");
      await load();
    } catch {
      toast.error("No se pudo agregar el paciente");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(patient: Patient) {
    try {
      await deletePatient(patient.id);
      toast.success("Paciente eliminado");
      await load();
    } catch {
      toast.error("No se pudo eliminar el paciente");
    }
  }

  const newPatients = useMemo(() => {
    const cutoff = daysAgoISO(7);
    return patients.filter((p) => toLocalISODate(new Date(p.createdAt)) >= cutoff);
  }, [patients]);

  const rows = useMemo(
    () =>
      patients.map((p) => {
        const patientEntries = entries.filter((e) => e.patientId === p.id);
        return {
          patient: p,
          compliance7: computeCompliance(p, patientEntries, 7),
          compliance30: computeCompliance(p, patientEntries, 30),
        };
      }),
    [patients, entries]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-purple-dark">
          Pacientes
        </h1>
        <p className="text-sm text-ink-soft">
          Gestiona pacientes y revisa su cumplimiento del ejercicio.
        </p>
      </div>

      {newPatients.length > 0 && (
        <Card>
          <CardHeader>
            <p className="font-heading text-sm font-semibold text-brand-purple-dark">
              Nuevos pacientes (últimos 7 días)
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {newPatients.map((p) => (
              <Link key={p.id} href={`/doctor/pacientes/${p.id}`}>
                <Badge
                  variant="secondary"
                  className="bg-accent text-accent-foreground hover:opacity-80"
                >
                  {p.name}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
            Agregar paciente
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddPatient}
            className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-name">Nombre</Label>
              <Input
                id="new-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-phone">Teléfono (opcional)</Label>
              <Input
                id="new-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-email">Correo (opcional)</Label>
              <Input
                id="new-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={adding || !name.trim()}
              className="brand-gradient text-white hover:opacity-90"
            >
              {adding ? "Agregando..." : "Agregar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="font-heading text-sm font-semibold text-brand-purple-dark">
            Todos los pacientes
          </p>
        </CardHeader>
        <CardContent>
          {loading && <p className="py-6 text-center text-sm text-ink-soft">Cargando...</p>}
          {!loading && rows.length === 0 && (
            <p className="py-6 text-center text-sm text-ink-soft">
              Aún no hay pacientes registrados.
            </p>
          )}
          {!loading && rows.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>7 días</TableHead>
                  <TableHead>30 días</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ patient, compliance7, compliance30 }) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <Link
                        href={`/doctor/pacientes/${patient.id}`}
                        className="font-semibold text-brand-purple-dark hover:underline"
                      >
                        {patient.name}
                      </Link>
                    </TableCell>
                    <TableCell>{compliance7}%</TableCell>
                    <TableCell>{compliance30}%</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-ink-soft hover:text-brand-magenta"
                            >
                              Eliminar
                            </Button>
                          }
                        />

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar a {patient.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Se eliminará el paciente y todos sus registros de ejercicio.
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(patient)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
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
