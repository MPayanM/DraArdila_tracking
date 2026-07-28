# Ejercicios de Masticación y Deglución — Dra. Sandra Ardila

App para el registro y seguimiento del ejercicio de masticación y deglución prescrito por la Dra. Sandra Ardila (fonoaudióloga).

## Stack

- Next.js + Tailwind + shadcn/ui
- Supabase (Postgres) — ver `supabase/migrations/`
- Vercel

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Configuración

Copia `.env.example` a `.env.local` y completa las credenciales del proyecto de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Estado actual

Implementado: flujo de paciente (autoregistro por nombre, registro por momento del día con alimento en texto libre, registro de fechas pasadas, eliminación de registros propios, cumplimiento %).

Pendiente: conexión a Supabase (falta `.env.local`), panel del doctor.
