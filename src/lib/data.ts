// Supabase-backed data access for the patient flow.
// Table shapes: supabase/migrations/0001_init.sql

import { supabase } from "@/lib/supabase";
import { type Moment, MOMENTS, toLocalISODate } from "@/lib/moments";

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

type PatientRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  required_moments: string[];
  treatment_end_date: string | null;
  created_at: string;
};

type EntryRow = {
  id: string;
  patient_id: string;
  date: string;
  moment: string;
  food: string;
  created_at: string;
};

function toPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    requiredMoments: row.required_moments as Moment[],
    treatmentEndDate: row.treatment_end_date ?? undefined,
    createdAt: row.created_at,
  };
}

function toEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    patientId: row.patient_id,
    date: row.date,
    moment: row.moment as Moment,
    food: row.food,
    createdAt: row.created_at,
  };
}

export async function findPatientByName(name: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .ilike("name", name.trim())
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? toPatient(data as PatientRow) : null;
}

export async function getPatient(id: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toPatient(data as PatientRow) : null;
}

export async function createPatient(name: string): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .insert({
      name: name.trim(),
      required_moments: MOMENTS.map((m) => m.id),
    })
    .select("*")
    .single();
  if (error) throw error;
  return toPatient(data as PatientRow);
}

export async function getOrCreatePatient(name: string): Promise<Patient> {
  const existing = await findPatientByName(name);
  return existing ?? createPatient(name);
}

export async function getEntries(patientId: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("patient_id", patientId)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as EntryRow[]).map(toEntry);
}

export async function addEntry(input: {
  patientId: string;
  date: string;
  moment: Moment;
  food: string;
}): Promise<Entry> {
  const { data, error } = await supabase
    .from("entries")
    .upsert(
      {
        patient_id: input.patientId,
        date: input.date,
        moment: input.moment,
        food: input.food,
      },
      { onConflict: "patient_id,date,moment" }
    )
    .select("*")
    .single();
  if (error) throw error;
  return toEntry(data as EntryRow);
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw error;
}

// --- Doctor-facing operations ---

export async function getAllPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PatientRow[]).map(toPatient);
}

export async function getEntriesSince(sinceISODate: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .gte("date", sinceISODate)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as EntryRow[]).map(toEntry);
}

export async function addPatientManual(input: {
  name: string;
  phone?: string;
  email?: string;
  requiredMoments: Moment[];
}): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .insert({
      name: input.name.trim(),
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      required_moments: input.requiredMoments,
    })
    .select("*")
    .single();
  if (error) throw error;
  return toPatient(data as PatientRow);
}

export async function deletePatient(id: string): Promise<void> {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw error;
}

export async function updatePatient(
  id: string,
  patch: { requiredMoments?: Moment[]; treatmentEndDate?: string | null }
): Promise<Patient> {
  const update: Record<string, unknown> = {};
  if (patch.requiredMoments) update.required_moments = patch.requiredMoments;
  if (patch.treatmentEndDate !== undefined)
    update.treatment_end_date = patch.treatmentEndDate;

  const { data, error } = await supabase
    .from("patients")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return toPatient(data as PatientRow);
}

export function computeCompliance(
  patient: Patient,
  entries: Entry[],
  days: number
): number {
  const required = patient.requiredMoments;
  if (required.length === 0) return 0;

  const today = new Date();
  let totalRequired = 0;
  let totalDone = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = toLocalISODate(d);
    const doneMoments = new Set(
      entries.filter((e) => e.date === iso).map((e) => e.moment)
    );
    totalRequired += required.length;
    totalDone += required.filter((m) => doneMoments.has(m)).length;
  }

  if (totalRequired === 0) return 0;
  return Math.min(100, Math.round((totalDone / totalRequired) * 100));
}

export type WeekCompliance = {
  label: string;
  startDate: string;
  endDate: string;
  compliance: number;
};

export type ComplianceReport = {
  weeks: WeekCompliance[];
  cumulative: number;
};

// Buckets entries into 7-day weeks starting from the patient's createdAt
// date, using the same required-vs-done counting as computeCompliance, plus
// a cumulative figure across the whole range.
export function computeWeeklyCompliance(
  patient: Patient,
  entries: Entry[]
): ComplianceReport {
  const required = patient.requiredMoments;
  if (required.length === 0) {
    return { weeks: [], cumulative: 0 };
  }

  const start = new Date(patient.createdAt);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays =
    Math.floor((today.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  const weekCount = Math.max(1, Math.ceil(totalDays / 7));

  const weeks: WeekCompliance[] = [];
  let cumulativeRequired = 0;
  let cumulativeDone = 0;

  for (let w = 0; w < weekCount; w++) {
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() + w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const clampedEnd = weekEnd > today ? today : weekEnd;

    let weekRequired = 0;
    let weekDone = 0;

    for (
      let d = new Date(weekStart);
      d <= clampedEnd;
      d.setDate(d.getDate() + 1)
    ) {
      const iso = toLocalISODate(d);
      const doneMoments = new Set(
        entries.filter((e) => e.date === iso).map((e) => e.moment)
      );
      weekRequired += required.length;
      weekDone += required.filter((m) => doneMoments.has(m)).length;
    }

    cumulativeRequired += weekRequired;
    cumulativeDone += weekDone;

    weeks.push({
      label: `Semana ${w + 1}`,
      startDate: toLocalISODate(weekStart),
      endDate: toLocalISODate(clampedEnd),
      compliance:
        weekRequired === 0 ? 0 : Math.min(100, Math.round((weekDone / weekRequired) * 100)),
    });
  }

  const cumulative =
    cumulativeRequired === 0
      ? 0
      : Math.min(100, Math.round((cumulativeDone / cumulativeRequired) * 100));

  return { weeks, cumulative };
}

// Which patient is "remembered" on this device — not sensitive, just a
// convenience so the name-only flow doesn't ask again every visit.
const CURRENT_PATIENT_KEY = "fono.currentPatientId";

export function getCurrentPatientId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CURRENT_PATIENT_KEY);
}

export function setCurrentPatientId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(CURRENT_PATIENT_KEY, id);
  else window.localStorage.removeItem(CURRENT_PATIENT_KEY);
}
