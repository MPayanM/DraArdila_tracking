# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Patients** — people prescribed a chewing/swallowing exercise by Dra. Sandra Ardila. They self-identify by name only (no password), log the exercise from their phone at up to 5 moments a day (breakfast, mid-morning snack, lunch, mid-afternoon snack, dinner), record what they were eating in free text, and can backdate or delete their own entries. No assumption of tech sophistication beyond ordinary phone/PWA use.

**Doctor (Dra. Sandra Ardila)** — sole administrator, a practicing speech therapist. Prescribes which of the 5 moments apply per patient, monitors compliance across her patient list from her own device, manages patients manually, and exports records. Single-account login (Supabase Auth), no multi-doctor/multi-clinic support in this version.

## Product Purpose

A clinical adherence tool: patients log a prescribed chewing/swallowing exercise (tongue-to-palate, teeth-clench swallow habituation) at specified daily moments; the doctor monitors per-patient compliance against exactly the moments she prescribed for that patient, not a generic daily count. Success = patients actually performing the exercise as prescribed, and the doctor being able to see who is falling behind at a glance.

## Positioning

Two purposes carried simultaneously, both currently active:

1. A working clinical compliance tool for Dra. Ardila's own patients today.
2. A demonstration/sales piece: because the product doubles as a portfolio artifact she can show other speech therapists/doctors, the polish and professionalism of the interface (not just its function) is a product requirement, not a nice-to-have. Neither purpose should be deprioritized in favor of the other.

The differentiating mechanism: compliance is calculated **per patient** against a doctor-defined subset of moments (`requiredMoments`), not a one-size-fits-all daily checklist — this reflects how she actually prescribes treatment (e.g., only lunch and dinner for one patient, all 5 for another).

## Operating Context

- Patient side: a responsive PWA used from a phone, installable to the home screen, used in-the-moment around meals (backdating supported for missed logging).
- Doctor side: a real login (Supabase Auth) dashboard, used from her own device to review patients, prescribe required moments, see a "new patients" list (last 7 days, no read/unread state), optionally set a treatment end date, and export logs (CSV/PDF).
- Deployment: Vercel, eventually linked from Dra. Ardila's personal/professional site. Integration method (own subdomain vs. iframe embed) is undecided pending knowledge of what platform her personal site runs on.
- Regulatory: Colombia's Ley 1581 de 2012 (habeas data) applies since the app collects health-related therapy data plus optional phone/email — a privacy notice/consent at patient registration is expected.

## Capabilities and Constraints

- Exactly 5 fixed exercise moments: breakfast, mid-morning snack, lunch, mid-afternoon snack, dinner. Not configurable beyond this set.
- Two roles only: patient (name-only identification) and doctor (single admin account). No per-patient PIN/password, no multi-doctor support.
- Compliance = (# of that patient's `requiredMoments` logged on a day) / (# of `requiredMoments`), capped at 100%; range compliance is the weighted average across the selected range (7 days / 30 days / custom).
- Patients: free-text food field (no predefined list), can log past dates, can freely delete their own entries without added confirmation friction.
- Doctor: manual add/delete of patients, "new patients" filtered to last 7 days, optional per-patient treatment end date (undefined by default), detailed log view with CSV and PDF export.
- Out of scope for this version: multi-tenant/multi-clinic architecture, per-patient PIN/password, automated reminder notifications (contact fields exist for later use, no send logic), predefined food list.
- Undecided: integration method with Dra. Ardila's personal site (subdomain link vs. iframe embed) — pending confirmation of what platform that site runs on.

## Brand Commitments

- Existing identity carried forward from the original prototype and current build: purple/magenta palette, Nunito/Poppins typography, the clinic's logo (`fono.webp`, and a code-based vector brand mark now in `src/components/brand-mark.tsx`).
- Current build already includes a 3D hero orb and logo badge (`src/components/three/`), page transitions, and a landing page (hero, exercise explainer, features grid, how-it-works, professional CTA) — these are live product surfaces, not concepts.

## Evidence on Hand

- `app_masticacion_multipaciente.html` — original single-file prototype; UI/flow reference only, its `window.storage` layer is not reused.
- `FONOAUDILOGIA EJERCICIOS.xlsx` — the doctor's original manual tracking spreadsheet, source of the compliance/reporting requirements.
- `fono.webp` — clinic logo asset.
- No testimonials, case studies, press, or real patient data exist yet; none should be fabricated for the sales-piece framing — the landing page must represent the tool honestly as new/in-development where relevant.

## Product Principles

1. Compliance logic is always per-patient against doctor-set required moments — never a generic daily count across all 5 moments.
2. The interface must satisfy both audiences at once: a functional daily tool for patients/doctor, and a polished artifact credible enough to show other clinicians as a sellable product.
3. Keep the two roles strictly separate and simple — no password complexity for patients, no multi-doctor architecture, resist scope creep into either.
4. Preserve the existing purple/magenta, Nunito/Poppins, logo-based visual identity as the foundation; extend it rather than replacing it wholesale.
5. Don't build ahead of confirmed scope — reminders, predefined food lists, and multi-tenant support stay out until explicitly requested.

## Accessibility & Inclusion

No project-specific accessibility requirement has been established beyond ordinary responsive/PWA usability on patients' own phones, which may vary in age and technical comfort — no requirement established beyond that.
