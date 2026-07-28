-- Chewing & swallowing exercise tracker — initial schema
-- Data model per instructions.md section 8.

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  required_moments text[] not null default array[
    'desayuno', 'media_manana', 'almuerzo', 'media_tarde', 'cena'
  ],
  treatment_end_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  date date not null,
  moment text not null check (
    moment in ('desayuno', 'media_manana', 'almuerzo', 'media_tarde', 'cena')
  ),
  food text not null,
  created_at timestamptz not null default now(),
  unique (patient_id, date, moment)
);

create index if not exists entries_patient_date_idx
  on public.entries (patient_id, date);

create index if not exists patients_created_at_idx
  on public.patients (created_at);

-- Row Level Security
-- Patients self-identify by name only (no auth/password), so the anon key
-- must be able to read/create patients and manage entries directly. Fields
-- reserved for the doctor (required_moments, treatment_end_date) and patient
-- deletion are restricted to the authenticated doctor account.

alter table public.patients enable row level security;
alter table public.entries enable row level security;

create policy "patients are publicly readable"
  on public.patients for select
  to anon, authenticated
  using (true);

create policy "anyone can self-register as a patient"
  on public.patients for insert
  to anon, authenticated
  with check (true);

create policy "only the doctor can update patient records"
  on public.patients for update
  to authenticated
  using (true)
  with check (true);

create policy "only the doctor can delete patients"
  on public.patients for delete
  to authenticated
  using (true);

create policy "entries are publicly readable"
  on public.entries for select
  to anon, authenticated
  using (true);

create policy "anyone can log an entry"
  on public.entries for insert
  to anon, authenticated
  with check (true);

create policy "anyone can delete an entry"
  on public.entries for delete
  to anon, authenticated
  using (true);
