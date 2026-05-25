# VortixPR Monorepo: frontend-ai/ merge

> Date: 2026-05-25
> Status: Implemented (branch `feat/merge-frontend-ai-monorepo` pushed, awaiting verification + merge)
> Author: Joey Luo + Claude (Opus 4.7)

---

## TL;DR — read this first if you have amnesia

**This repo (`bd/a-new-pr-agency`, GitHub `darwin7381/vortixstream-pr-agency`) is the canonical VortixPR monorepo.** It contains:

```
bd/a-new-pr-agency/                       ← the monorepo (current cwd if you're working on VortixPR)
├── backend/                              ← FastAPI + Python 3.12 + asyncpg + JSONB CMS
│                                            + JWT/OAuth + Postgres 15 (Railway)
├── frontend/                             ← React 18 + Vite 6 + TS + Radix UI + Tailwind v4
│                                            (the Crypto site — destined for /crypto sub-path)
├── frontend-ai/                          ← Next.js 16 + React 19 + Tailwind v4 ← NEW (2026-05-25)
│                                            (the AI main site — destined for / on vortixpr.com)
├── admin/                                ← CMS admin UI
├── cms-migration/, scripts/, standards/  ← shared infra
└── docs/superpowers/specs/               ← architecture specs (this file lives here)
```

**Do NOT create a separate repo for any new VortixPR frontend or service. Everything goes here.**

If a previous session started building `~/Development/vortixpr-ai/` as a standalone repo, that work has been merged into `frontend-ai/` here. The standalone repo `darwin7381/vortixpr-ai` is preserved for history but should be archived once verification is done.

---

## Architecture timeline (so you don't lose context again)

### 2026-04-08 — "Vortix AI/Crypto Split" spec

Original plan: keep ONE React + Vite app, use React Router nested layouts to route `/` → AILayout (new AI brand) and `/crypto/*` → CryptoLayout (existing crypto brand). Same domain `vortixpr.com`. AI side uses static constants (no CMS calls). Spec: `docs/superpowers/specs/2026-04-08-vortix-ai-crypto-split-design.md`. Plan: `docs/superpowers/plans/2026-04-08-vortix-ai-crypto-split.md`.

Work started on branch `feature/vortix-ai-crypto-split` (worktree `.worktrees/vortix-ai-crypto-split`). 30+ commits prefixed `feat(ai)` / `fix(ai)` / `feat(crypto)`. Key changes:
- `frontend/src/layouts/{AILayout,CryptoLayout,SharedLayout}.tsx` (nested layout pattern)
- `frontend/src/pages/ai/*` and `frontend/src/pages/crypto/*`
- `frontend/src/components/ai/AINavigation.tsx`, `AIFooter.tsx` (separated from CryptoNavigation/CryptoFooter)
- DB: `audience` column added to `pr_packages` (default `crypto`, allows `ai`)
- API: `audience` filter on `/api/public/pr-packages/`
- Crypto sections refactored with optional `dataOverride` prop so AI pages can reuse components with different data

### 2026-05-24 — "Next.js pivot" strategy change

Joey and Claude decided the AI marketing site needed a stronger editorial-cinematic visual that was harder to achieve inside the existing Vite + Radix UI app (too much established crypto-styling muscle memory in components, plus Next.js 16 + Tailwind v4 gives better image optimization + RSC for marketing pages).

New plan:
- **NEW main site** built fresh on Next.js 16 + React 19 + Tailwind v4 (no Radix, no existing components)
- **OLD crypto site** (Vite + React) preserved verbatim, will be served at `/crypto` via reverse proxy at deploy time
- **Shared backend** (FastAPI from this monorepo) will serve both
- Reverse proxy implementation deferred — to be configured at deploy time (Cloudflare Workers / Vercel rewrites / Nginx)

Initial mistake: scaffolded the new Next.js app as a standalone repo at `~/Development/vortixpr-ai/` (GitHub `darwin7381/vortixpr-ai`). This was wrong — it should have been inside this monorepo from day one.

### 2026-05-25 — Monorepo merge (this spec)

Merged the standalone vortixpr-ai work into this repo as `frontend-ai/`. Branch `feat/merge-frontend-ai-monorepo`, commit `bf37c94`.

What was copied (excluding `node_modules`, `.next`, `.git`, `dist`, `build`, `tsconfig.tsbuildinfo`, `.antigravitycli`):
- `frontend-ai/src/` — full Next.js app source (Hero, WhyVortix, Services, Packages, Lyro, Trusted, Publisher, FAQ, Contact, FinalCTA, Footer, LogoStrip, FloatingNav, WorldStrip sections + globals.css + page.tsx + layout.tsx)
- `frontend-ai/public/` — painterly bg images (`world-*.jpeg`, `hero-bg.jpeg`, `cat-astronot.jpeg` etc.)
- `frontend-ai/package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- `frontend-ai/.agents/skills/` — taste-skill + design-related skills used during the build
- `frontend-ai/AGY-CONTEXT.md` — primer used for Antigravity CLI design sessions
- `frontend-ai/.gitignore` (per-folder ignores)

Root `.gitignore` updated to add `frontend-ai/{node_modules,.next,.turbo,dist,build,tsconfig.tsbuildinfo}`.

### Pending (NOT done in 05-25 commit)

- Reverse proxy config (Cloudflare / Vercel rewrites) — deploy concern, Joey is handling separately
- Archive `darwin7381/vortixpr-ai` standalone repo on GitHub
- Delete `~/Development/vortixpr-ai/` local directory
- PR merge into `main`
- Reconcile the legacy `feature/vortix-ai-crypto-split` worktree:
  - **Frontend portions are superseded** by `frontend-ai/` (no longer needed — Next.js replaces the in-Vite AI pages)
  - **Backend portions (DB `audience` column, API filter) are still useful** — cherry-pick into main when AI frontend wires up real backend data, or keep dormant until then

---

## Tech stack summary (current monorepo)

| Component | Stack |
|---|---|
| `backend/` | Python 3.12, FastAPI, asyncpg (no ORM), JSONB-heavy CMS, JWT 15min/7day refresh, Google OAuth, bcrypt, Postgres 15 on Railway, Cloudflare R2 media, Resend email, Notion blog sync |
| `frontend/` (Crypto) | React 18, TypeScript, Vite 6, Tailwind v4, Radix UI (30+ components), 35+ admin pages with glassmorphism, React Router |
| `frontend-ai/` (AI Main) | React 19, Next.js 16 (App Router), TypeScript strict, Tailwind v4 (CSS-first), Fraunces/Onest/JetBrains_Mono via next/font/google, custom WorldStrip pattern, no shadcn, no Radix |
| `admin/` | (CMS admin UI) |

---

## Critical gotchas to remember

1. **Tailwind v4 font-family bug** — `font-[var(--font-display)]` arbitrary class does NOT apply font-family in v4. `frontend-ai/src/app/globals.css` defines `.t-display`, `.t-h2`, `.t-h3`, `.t-lead`, `.t-body`, `.t-quote`, `.t-num-display`, `.t-caption` helper classes that bind font-family + size + line-height + tracking. Use those, not arbitrary classes. (See `frontend-ai/AGY-CONTEXT.md` for full primer.)

2. **WorldStrip backbone** — `frontend-ai/src/components/sections/WorldStrip.tsx` wraps consecutive painterly sections under ONE shared background image to prevent visual breaks. Page structure groups Hero → LogoStrip → (Why+Services in Strip 1) → (Packages+Platform in Strip 2) → Lyro → (Trusted+Publisher+FAQ in Strip 3) → (Contact+FinalCTA in Strip 4) → Footer.

3. **AI side static, Crypto side CMS-driven** — per 04-08 spec decision (YAGNI on CMS expansion). When AI content stabilizes, may migrate it into the backend CMS with a `site='ai'` schema column.

4. **No Antigravity scratch in commits** — `frontend-ai/.antigravitycli/` was deleted before commit. agy CLI scratch lives in `~/.gemini/antigravity-cli/scratch/`, not in the repo.

5. **Backend `audience` column already exists** — `pr_packages.audience` (default `'crypto'`, can be `'ai'`). API `/api/public/pr-packages/?audience=ai` filter works. Wired up via worktree commits already on `main`.

---

## Cross-references

- Root README: `/Users/JL/Development/bd/a-new-pr-agency/README.md`
- Project analysis: `/Users/JL/Development/bd/a-new-pr-agency/PROJECT_ANALYSIS_2026-04-07.md`
- 04-08 split spec: `docs/superpowers/specs/2026-04-08-vortix-ai-crypto-split-design.md`
- 04-08 split plan: `docs/superpowers/plans/2026-04-08-vortix-ai-crypto-split.md`
- frontend-ai primer for AI sessions: `frontend-ai/AGY-CONTEXT.md`
- Tailwind v4 lessons: `TAILWIND_V4_COMPLETE_RULES_AND_DIAGNOSIS.md`
