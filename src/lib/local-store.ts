// Temporary client-side data layer, standing in for Supabase until
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are configured.
// Shape mirrors supabase/migrations/0001_init.sql so swapping this module
// for real Supabase calls later is a drop-in replacement.

import { type Moment, MOMENTS } from "@/lib/moments";

export type Patient = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  requiredMoments: Moment[];
  treatmentEndDate?: string;
  createdAt: string;
};

export type Entry = {
  id: string;
  patientId: string;
  date: string;
  moment: Moment;
  food: string;
  createdAt: string;
};

const PATIENTS_KEY = "fono.patients";
const ENTRIES_KEY = "fono.entries";
const CURRENT_PATIENT_KEY = "fono.currentPatientId";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getPatients(): Patient[] {
  return read<Patient[]>(PATIENTS_KEY, []);
}

export function findPatientByName(name: string): Patient | undefined {
  const normalized = name.trim().toLowerCase();
  return getPatients().find((p) => p.name.trim().toLowerCase() === normalized);
}

export function getPatient(id: string): Patient | undefined {
  return getPatients().find((p) => p.id === id);
}

export function createPatient(name: string): Patient {
  const patient: Patient = {
    id: uid(),
    name: name.trim(),
    requiredMoments: MOMENTS.map((m) => m.id),
    createdAt: new Date().toISOString(),
  };
  const patients = [...getPatients(), patient];
  write(PATIENTS_KEY, patients);
  return patient;
}

export function getOrCreatePatient(name: string): Patient {
  return findPatientByName(name) ?? createPatient(name);
}

export function getCurrentPatientId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CURRENT_PATIENT_KEY);
}

export function setCurrentPatientId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(CURRENT_PATIENT_KEY, id);
  else window.localStorage.removeItem(CURRENT_PATIENT_KEY);
}

export function getEntries(patientId: string): Entry[] {
  return read<Entry[]>(ENTRIES_KEY, []).filter((e) => e.patientId === patientId);
}

export function addEntry(input: {
  patientId: string;
  date: string;
  moment: Moment;
  food: string;
}): Entry {
  const all = read<Entry[]>(ENTRIES_KEY, []);
  const withoutDuplicate = all.filter(
    (e) =>
      !(
        e.patientId === input.patientId &&
        e.date === input.date &&
        e.moment === input.moment
      )
  );
  const entry: Entry = {
    id: uid(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  write(ENTRIES_KEY, [...withoutDuplicate, entry]);
  return entry;
}

export function deleteEntry(id: string) {
  const all = read<Entry[]>(ENTRIES_KEY, []);
  write(
    ENTRIES_KEY,
    all.filter((e) => e.id !== id)
  );
}

export function computeCompliance(patient: Patient, days: number): number {
  const required = patient.requiredMoments;
  if (required.length === 0) return 0;

  const entries = getEntries(patient.id);
  const today = new Date();
  let totalRequired = 0;
  let totalDone = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const doneMoments = new Set(
      entries.filter((e) => e.date === iso).map((e) => e.moment)
    );
    totalRequired += required.length;
    totalDone += required.filter((m) => doneMoments.has(m)).length;
  }

  if (totalRequired === 0) return 0;
  return Math.min(100, Math.round((totalDone / totalRequired) * 100));
}
