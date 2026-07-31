---
name: Dra. Sandra Ardila — Ejercicios de Masticación y Deglución
description: A calm, editorial clinical adherence tool with a living, interactive depth-field background.
colors:
  brand-purple-dark: "#3c2a72"
  brand-purple: "#5b3c8e"
  brand-magenta: "#c3287d"
  brand-magenta-soft: "#e8a8c8"
  brand-lavender: "#f4f0fa"
  brand-periwinkle: "#b9aee8"
  brand-gold: "#c99b3f"
  ink: "#2e2440"
  ink-soft: "#6f6389"
  success: "#3fae7a"
  warning: "#e8a23c"
  background: "#f4f0fa"
  card: "#ffffff"
  border: "#e4dcf2"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 4vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.08
  heading:
    fontFamily: "Inter, ui-sans-serif, system-ui"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0.54rem"
  md: "0.72rem"
  lg: "0.9rem"
  xl: "1.26rem"
  2xl: "1.62rem"
  full: "9999px"
spacing:
  card: "1rem"
  section-y: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.brand-purple}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "0 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, {colors.brand-purple}, black 15%)"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  card-default:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card}"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "2rem"
---

# Design System: Dra. Sandra Ardila — Ejercicios de Masticación y Deglución

## Overview

**Creative North Star: "The Drifting Field"**

A clinical adherence tool that earns trust two ways at once: precise, uncluttered structure for the daily work of logging and reviewing an exercise, set against a living, interactive background of soft, organic, glass-like blobs drifting in brand purple/magenta/gold/periwinkle. The field is never a decoration parked in one corner — it spans the full viewport on every page, shifts with cursor and scroll, and reads as one continuous atmosphere rather than a UI widget. It is expressive (`"hero"` variant) on the landing page and deliberately subdued (`"ambient"` variant) everywhere data and forms need to lead — auth screens, the doctor dashboard, the patient tracker. Working surfaces (cards, tables, forms) stay flat, ring-bordered, and fast to scan; the field supplies the warmth and motion so the UI chrome doesn't have to.

Typography moved to a confident editorial pairing — Instrument Serif for display headlines, Inter for everything else (headings, body, UI) — replacing the earlier Fraunces/Sora/Nunito trio. Collapsing "heading" and "body" onto one grotesk (Inter) keeps the system from drifting into inconsistent font-token usage; Instrument Serif is reserved for the single largest headline on a page.

**Key Characteristics:**
- The depth field is a background, not an ornament: full-bleed, interactive (pointer parallax + scroll drift), mounted once at the root and never duplicated per page.
- Blobs are soft and organic (distorted, smooth-shaded spheres), not hard-faceted geometry — abstract atmosphere, not solid objects.
- A perspective-correct empty column runs down the center of the viewport at every depth, so blobs never drift behind the centered reading column (see The Clear Column Rule).
- Two intensities only — `hero` (landing) and `ambient` (everywhere else) — no per-page bespoke tuning.
- The brand gradient (`.text-gradient`) is reserved for exactly one emphasized headline clause; primary buttons use a flat brand-purple fill instead of a gradient, keeping the gradient rare and meaningful.
- All iconography is `lucide-react` line icons at a consistent stroke weight — no emoji anywhere in the product.
- Flat, ring-bordered surfaces everywhere outside the field; depth is implied by structure, not shadow.

## Colors

Two brand hues (deep violet, warm magenta) carry almost all color meaning; everything else is a quiet ink/lavender neutral scale, plus gold and periwinkle reserved for the depth field's shard palette.

### Primary
- **Brand Purple** (`#5b3c8e`): primary actions (solid fill, not gradient), links, focus states, and one of the depth field's shard colors. Dominant identity color.
- **Brand Purple Dark** (`#3c2a72`): brand-mark ink, deep accents, dark-mode primary foreground context.

### Secondary
- **Brand Magenta** (`#c3287d`): the warm half of the reserved-for-headlines brand gradient, secondary chart accents, the shared "a" in the wordmark, and a depth-field shard color. Rarely used solo as a fill.
- **Brand Magenta Soft** (`#e8a8c8`): soft highlights, low-emphasis brand text.

### Tertiary
- **Brand Periwinkle** (`#b9aee8`): brand-mark quadrant fill and a depth-field shard color.
- **Brand Gold** (`#c99b3f`): a sparing depth-field shard color and warning/chart accent — never a primary or secondary action color.

### Neutral
- **Ink** (`#2e2440`): primary text color, a warm near-black rather than true gray.
- **Ink Soft** (`#6f6389`): secondary/muted text, captions, supporting copy — deepened from the original `#7a6f92` to clear WCAG AA (4.5:1) against the lavender background.
- **Lavender** (`#f4f0fa`): page background and sidebar-accent surfaces — the system's "paper," left transparent at the page-root level so the depth field shows through.
- **Border** (`#e4dcf2`): the ring/border color used on cards, inputs, and dividers instead of shadows.
- **Card** (`#ffffff`): opaque elevated surface fill against the lavender/field background.
- **Success** (`#3fae7a`) / **Warning** (`#e8a23c`): status colors for compliance states, used sparingly and only for meaning, never decoration.

### Named Rules
**The Rare Gradient Rule.** `.text-gradient` (purple→magenta) appears on at most one emphasized clause per screen — typically the hero headline's italic phrase. Buttons and other UI use a flat `brand-purple` fill instead of the gradient, so the gradient stays a rare, headline-only signal rather than a repeated button treatment.

**The One Field Rule.** Exactly one interactive background — the depth field — exists across the whole app, mounted once at the root layout. No page mounts its own decorative background, blob, or secondary 3D element.

**The Clear Column Rule.** Blobs are excluded from a center column at every depth, sized as a fraction of that depth's own on-screen half-width (perspective-correct, not a flat world-space offset) — so a near blob and a far blob are both kept equally clear of the centered reading column regardless of how much closer the near one is to the camera.

## Typography

**Display Font:** Instrument Serif (weight 400, normal/italic) with Georgia fallback
**Heading Font:** Inter (500–700 weight) with system-ui fallback
**Body Font:** Inter (400–500 weight) with system-ui fallback

**Character:** A striking, high-contrast editorial serif for the single largest headline on a page, paired with one clean, precise grotesk for every other role — structural headings, body copy, labels, and UI. Reads as confident and premium without splitting attention across three typefaces.

### Hierarchy
- **Display** (weight 400, `clamp(2.25rem, 4vw, 3.75rem)`, line-height 1.08, Instrument Serif): hero headlines only; the emphasized clause within is set in italic with `.text-gradient`.
- **Heading** (weight 600–700, Inter, 1.125rem–1.5rem, line-height 1.3): section titles, card titles, nav-level headings.
- **Body** (weight 400, Inter, 0.875rem–1rem, line-height 1.6): paragraph copy, table content, form labels; wrap long-form copy to ~65ch.
- **Label** (weight 500–600, Inter, 0.75rem–0.8rem): badges, buttons, table headers, status chips.

### Named Rules
**The One-Phrase Italic Rule.** Instrument Serif italic is reserved for a single emphasized clause per headline. It never sets a full sentence or paragraph.

**The One-Grotesk Rule.** Every non-display role (heading, body, label) renders the same family (Inter) at different weights. Don't introduce a second sans-serif for any UI role — weight and size carry the hierarchy, not a font swap.

## Layout

Content sits in a centered max-width container (`max-w-6xl` for app chrome/nav, `max-w-3xl` for the landing hero — narrowed from a two-column split to a single centered column now that the depth field, not a side-mounted 3D element, carries the visual interest), with generous vertical rhythm on marketing sections (`py-16` to `py-28`) and tighter, denser spacing inside dashboard/table views. Card internal spacing is a single `--card-spacing` token (1rem default, 0.75rem in the `sm` card variant) so header/content/footer padding stays consistent without per-section overrides.

## Elevation & Depth

Flat by default: cards and inputs are distinguished from the background by a 1px ring/border (`ring-foreground/10`, `border-input`), not a box-shadow. The one exception is the sticky landing nav's `.glass-panel` — a translucent, blurred surface with a soft ambient shadow tinted brand-purple. Structural depth in the UI comes from ring borders and background/card contrast, never a general shadow scale; spatial depth comes entirely from the depth field's own layered, parallaxing shards behind the UI.

### Shadow Vocabulary
- **glass-panel-ambient** (`box-shadow: 0 20px 45px -20px color-mix(in oklab, var(--brand-purple) 35%, transparent)`): under the sticky nav only, paired with the blur. Not used elsewhere.

### Named Rules
**The Ring-Not-Shadow Rule.** Structural surfaces (cards, inputs, tables) gain edges from a 1px ring/border, never a drop shadow. Reserve shadow for the one glass-panel moment.

## Shapes

Radius is built from a single `--radius: 0.9rem` root token scaled up/down (`sm` 0.6×, `md` 0.8×, `lg` 1×, `xl` 1.4×, `2xl` 1.8×, `3xl` 2.2×, `4xl` 2.6×) — every rounded corner in the system traces back to one dial. Cards and their header/footer slices use `rounded-xl`; buttons and inputs use `rounded-lg`; small icon buttons round down further. Pills/badges/status chips go fully round (`rounded-4xl` / `9999px`). The brand mark itself uses a squircle clip (`rx="22"` on a 100-unit viewBox) rather than a plain rounded rect — its own signature, not echoed elsewhere. The depth field's blobs are smooth, distorted spheres (high-subdivision icosahedra wrapped in a noise-distortion material) — organic and rounded, echoing the UI's soft-corner language rather than contrasting with it.

## Components

### Depth Field (signature component)
A full-viewport, fixed, `-z-10` WebGL background (`@react-three/fiber` + drei's `MeshDistortMaterial`) of glossy, liquid, semi-transparent blobs layered at varying depth. Each blob visibly morphs (stronger distortion amplitude than a gentle ambient wobble), breathes with a slow scale pulse, and slowly cycles hue within a bounded arc around its own brand color (purple/magenta/gold/periwinkle) — an iridescent, abstract, slightly psychedelic surface rather than a flat static shape. Blobs drift with a slow autonomous bobble, parallax against cursor position (tracked via a window-level pointer listener, not canvas hit-testing, since the field sits behind all page content), and shift with scroll. A perspective-correct center column stays blob-free at every depth (The Clear Column Rule) so nothing ever drifts behind headlines or body copy. Two variants: `hero` (20 blobs, fuller opacity, landing page only) and `ambient` (10 blobs, ~55% opacity, every other route). Freezes completely under `prefers-reduced-motion: reduce`. Mounted exactly once, at the root layout, variant chosen by route — never duplicated per page.

### Buttons
- **Shape:** `rounded-lg` (0.9rem), squares off further at `xs`/`sm` sizes.
- **Primary:** flat `brand-purple` fill with white text — reserved for the single highest-priority action per screen. No longer a gradient fill (see The Rare Gradient Rule); the gradient now lives only on headline text.
- **Secondary/Outline/Ghost:** carry the everyday UI — outline uses `border-border` with a muted hover fill; ghost has no border and only a muted hover background.
- **Hover/Focus:** default variant darkens slightly on hover; all variants get a 3px `ring-ring/50` focus ring plus a border color shift on `focus-visible`; active states nudge 1px down for tactile press feedback.
- **Destructive:** low-emphasis by default — tinted background (`bg-destructive/10`) rather than a solid red fill, escalating only on hover.

### Cards / Containers
- **Corner Style:** `rounded-xl`, header/footer slices inherit the same radius top/bottom.
- **Background:** solid white (`--card`) against the lavender/field background — page-root wrappers stay background-transparent so the depth field is visible; only `--card` surfaces are opaque.
- **Shadow Strategy:** none — see Elevation & Depth. Definition comes from `ring-1 ring-foreground/10`.
- **Border:** the ring described above stands in for a border; footer adds a literal top border with a muted background tint.
- **Internal Padding:** governed by the `--card-spacing` token (1rem default, 0.75rem for `size="sm"`).

### Inputs / Fields
- **Style:** transparent background, `border-input`, `rounded-lg`, `h-8` default height, `text-base` on mobile stepping to `text-sm` at `md` breakpoint to avoid iOS zoom.
- **Focus:** border shifts to `border-ring` plus a 3px `ring-ring/50` glow — same focus language as buttons.
- **Error/Disabled:** invalid state gets a destructive-tinted border and ring; disabled drops opacity to 50%.

### Icons
All iconography is `lucide-react`, stroke weight 1.75, sized to context (inline labels: 16px; card-level moment icons: 32px). No emoji anywhere in the product — the five exercise moments (breakfast, mid-morning snack, lunch, mid-afternoon snack, dinner) map to `Sunrise`, `Apple`, `Utensils`, `Sandwich`, `Moon` respectively, defined once in `src/lib/moments.ts` and reused everywhere the moments appear.

### Badges / Chips
- **Style:** fully rounded (`rounded-4xl`), compact (`h-5`), default variant fills solid brand-primary; outline/ghost/secondary variants exist for lower-emphasis status labels.

### Navigation
- **Style:** sticky, translucent glass-panel with a hairline bottom border; brand mark on the left (icon + wordmark only — no tagline), 1–2 buttons on the right, both flat brand-purple or outline, never gradient.

### Brand Mark
A two-part mark: a squircle-clipped four-quadrant icon (purple-dark, magenta, and two periwinkle quadrants) with a white cochlea-spiral-and-swallow-arc line drawing on top, paired with a wordmark ("sandrardila") where "sandra" and "ardila" merge on a shared, magenta-colored "a". Rendered as inline SVG/JSX. Carries no tagline — the wrong-specialty "Centro de audición y equilibrio" line was removed rather than replaced; no clinical tagline claim ships until confirmed with Dra. Ardila.

## Do's and Don'ts

### Do:
- **Do** keep the depth field to exactly two variants (`hero`, `ambient`) chosen by route — never hand-tune a third intensity for a specific page.
- **Do** compute any blob-placement exclusion zone as a fraction of that blob's own on-screen size at its depth (The Clear Column Rule), never as a flat world-space offset — a fixed offset protects far objects but leaves near ones drifting behind text.
- **Do** avoid shard/blob colors close in luminance to `--ink` (e.g. `brand-purple-dark`) — a background element close to the text color's own darkness can wash text out instead of sitting behind it.
- **Do** reserve `.text-gradient` for one emphasized headline clause per screen; use flat `brand-purple` for every button, including primary CTAs.
- **Do** keep page-root wrappers background-transparent so the depth field shows through; only `--card` and other explicit surfaces should be opaque.
- **Do** use `lucide-react` for every icon need — never emoji, never a mix of icon systems on the same screen.
- **Do** derive every corner radius from the single `--radius` root token rather than hardcoding a new pixel value.
- **Do** build structural depth from a 1px ring/border and background contrast, never a drop shadow, outside the sticky nav.

### Don't:
- **Don't** mount a per-page decorative background (blob, gradient, secondary 3D element) — the depth field is the only atmosphere layer (The One Field Rule).
- **Don't** apply the brand gradient to a button fill; it's a headline-only treatment now.
- **Don't** add a general shadow scale for card/dropdown elevation — that's a departure from the Ring-Not-Shadow Rule.
- **Don't** introduce a second sans-serif for any heading/body/label role, or a second italic-emphasis pattern beyond the hero headline.
- **Don't** fabricate testimonials, patient counts, clinical outcome claims, or specialty taglines on sales-facing surfaces — no real evidence exists yet (see `PRODUCT.md`'s Evidence on Hand).
