# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server on **port 9002** (not 3000).
- `npm run build` / `npm run start` — production build / serve.
- `npm run lint` — `next lint`.
- `npm run typecheck` — `tsc --noEmit`. **Always use this to validate types**; `next build` is configured to ignore both TS and ESLint errors (see [next.config.ts](next.config.ts)).
- `npm run genkit:dev` / `npm run genkit:watch` — start the Genkit dev UI against [src/ai/dev.ts](src/ai/dev.ts) for testing AI flows in isolation.
- `npx tsx src/scripts/seed.ts` — seed Supabase from the static data in [src/data/](src/data/). Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

There is no test runner configured.

## Architecture

This is a personal portfolio built on **Next.js 15 App Router** with two surfaces: a public marketing site (`/`) and an admin CRUD panel (`/admin`). It is bilingual-ready but UI strings are Spanish.

### Data flow: Supabase-first with static fallback

The portfolio content (personal info, projects, skills, education, etc.) lives in **Supabase Postgres**. The static files in [src/data/personal-info.ts](src/data/personal-info.ts) and [src/data/projects.ts](src/data/projects.ts) are *fallbacks*, not the source of truth — they are used when the Supabase fetch throws. Both [src/app/layout.tsx](src/app/layout.tsx) and [src/app/page.tsx](src/app/page.tsx) implement this fallback pattern.

The single fetch entry point is `getPortfolioData()` in [src/lib/data-fetching.ts](src/lib/data-fetching.ts), which:
1. Issues 8 parallel `select` calls (`personal_info`, `education`, `experience`, `skills`, `additional_training`, `certificates`, `socials`, `projects`).
2. Normalizes column names — Postgres lowercases unquoted identifiers, so the code accepts both `shortBio`/`shortbio`, `imageUrl`/`imageurl`, `isInProduction`/`isinproduction`, etc. **Preserve this normalization when adding new fields with camelCase names.**
3. Groups `skills` rows by their `category` column into `Record<string, Skill[]>` dynamically — categories are data, not code. The `/admin?section=categories` route renames categories by bulk-updating the `category` column.

Both root pages set `export const revalidate = 0` to disable ISR and always hit the DB.

### Icons as data

Icons are stored as **strings** in both the DB and static data. In the DB, the `icon_name` column on every table stores icon names as strings. In the static data ([src/data/personal-info.ts](src/data/personal-info.ts)), icons are stored directly as `icon: 'IconName'` (string literals, not function references).

Icons are resolved at render time via [src/components/shared/LucideIcon.tsx](src/components/shared/LucideIcon.tsx), which looks up `Icons[name]` from `lucide-react` and falls back to `HelpCircle`. The `sanitize()` helpers in `layout.tsx` / `page.tsx` extract icon names from DB rows before passing data to Client Components. Component rendering logic (in [AboutSection.tsx](src/components/sections/AboutSection.tsx), [CertificatesSection.tsx](src/components/sections/CertificatesSection.tsx), [SkillBadge.tsx](src/components/shared/SkillBadge.tsx), [Footer.tsx](src/components/layout/Footer.tsx)) checks `typeof icon === 'string'` and passes string icons to `<LucideIcon name={...} />`.

The seed script ([src/scripts/seed.ts](src/scripts/seed.ts)) uses `getIconName()` helper to extract icon name strings from the static data, handling both legacy function references and new string icons, then inserts them into the DB.**When adding a new entity that needs an icon, use `icon: 'IconName'` (string) in static data and render via `<LucideIcon name={...} />`.**

### Supabase client

[src/lib/supabase.ts](src/lib/supabase.ts) creates a single browser-safe client (`supabase`) used from both server and client code, plus `getSupabaseAdmin()` for server-only operations needing the service role key. If the env vars are missing, a **Proxy fallback** returns no-op `from()` chains so the app renders without crashing — be aware that DB writes may silently no-op in that state.

Admin mutations (e.g. [src/components/admin/ListManager.tsx](src/components/admin/ListManager.tsx)) call `supabase.from(...).upsert/delete` directly from the **browser** with the anon key. RLS is enabled on all tables but the policies in [supabase/migrations/create_tables.sql](supabase/migrations/create_tables.sql) are `USING (true) WITH CHECK (true)` — i.e. wide open. There is **no auth on `/admin`**; do not assume any access control exists.

### Admin panel

`/admin` is a single page that switches managers via `?section=...` query param (see [src/app/admin/page.tsx](src/app/admin/page.tsx)). Generic CRUD lives in [ListManager.tsx](src/components/admin/ListManager.tsx) and is driven by a `fields` config — add a new table by adding a `section` branch with the right `table` + `fields` array. `responsibilities` is special-cased as a comma-separated string ↔ `text[]` array.

[ConditionalHeader.tsx](src/components/layout/ConditionalHeader.tsx) / [ConditionalFooter.tsx](src/components/layout/ConditionalFooter.tsx) hide the public chrome on `/admin` routes by checking `usePathname()`.

### AI flows (Genkit)

[src/ai/genkit.ts](src/ai/genkit.ts) configures Genkit with `googleAI()` and `gemini-2.0-flash`. The only flow today is [src/ai/flows/generate-project-descriptions.ts](src/ai/flows/generate-project-descriptions.ts) — server-only (`'use server'`), exposes `generateProjectDescriptions()` for SEO copy. Flows must be imported in [src/ai/dev.ts](src/ai/dev.ts) to be discoverable by the Genkit dev UI.

### Styling

- shadcn/ui under [src/components/ui/](src/components/ui/) (config in [components.json](components.json)). Use these primitives rather than introducing new component libraries.
- Tailwind + the `glass-card`, `glass-panel`, `apple-button`, `apple-input`, `admin-bg` utility classes used throughout the admin (defined in [src/app/globals.css](src/app/globals.css)).
- Fonts: PT Sans (body) and Playfair Display (headlines), loaded via `next/font/google` in `layout.tsx` as CSS vars.

### Env

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, also have hard-coded fallbacks in `supabase.ts`.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, required for the seed script and `getSupabaseAdmin()`.
- `EMAILJS_SERVICE_ID` / `EMAILJS_TEMPLATE_ID` / `EMAILJS_PUBLIC_KEY` — re-exported as `NEXT_PUBLIC_*` via [next.config.ts](next.config.ts) for the contact form.
