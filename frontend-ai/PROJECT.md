# frontend-ai/ — VortixPR Main Marketing Site

> **Read this if you're a fresh AI session working in this folder.**
> Last updated: 2026-05-25

---

## What this folder is

This is the **main public marketing site for VortixPR** — `https://vortixpr.com/` (in production) / `https://vortixpr-ai.tunnel.fud.city/` (current dev tunnel) / `http://localhost:3001/` (dev).

It is **ONE of three top-level apps** in the VortixPR monorepo (the repo root is at `bd/a-new-pr-agency/`):

```
bd/a-new-pr-agency/        ← monorepo (GitHub: darwin7381/vortixstream-pr-agency)
├── backend/               ← FastAPI + Python (shared API/CMS/auth)
├── frontend/              ← React 18 + Vite 6 + Radix UI (the Crypto site — destined for /crypto sub-path)
├── frontend-ai/           ← YOU ARE HERE (Next.js 16 + React 19 + Tailwind v4)
└── admin/                 ← CMS admin UI
```

**This is NOT a standalone repo.** Earlier (2026-05-24) I scaffolded it as a separate repo `darwin7381/vortixpr-ai` by mistake. On 2026-05-25 it was merged into this monorepo. The standalone repo on GitHub still exists but is pending archive.

---

## The business — why this exists

VortixPR is the PR agency arm of Joey Luo's Crab Labs. Original product (2025 → 2026 Q1) was a **Crypto-PR agency**: pitching Crypto projects into TechCrunch / The Block / CoinDesk / etc. The product worked, but the market signal in Q2 2026 became clear:

- **AI startups are the new high-LTV PR client segment**, not crypto
- The existing crypto site reads as a niche crypto vendor — wrong positioning for AI founders
- AI founders evaluate PR agencies the way they evaluate design studios (taste, editorial weight) — the existing Vite + Radix UI site fails that bar

So the pivot 2026-Q2:

1. **Re-position the main brand `VortixPR` as AI-first** — services rebranded around "Global press distribution / PR & narrative strategy / Asia localization / Founder & personal branding" for AI startups, AI tooling companies, AI infrastructure
2. **Crypto offering preserved but demoted** — kept verbatim at `/crypto/*` sub-path so existing relationships and SEO aren't broken, but it's no longer the front door
3. **One domain, one brand house, two product surfaces** — `vortixpr.com/` = AI (this app), `vortixpr.com/crypto/*` = Crypto (the `frontend/` Vite app), `vortixpr.com/api/*` + `/admin/*` = shared backend

This `frontend-ai/` folder is the AI product surface.

---

## Architecture decision history (so future-you doesn't lose context)

### 2026-04-08 — First split attempt: nested React Router layouts

Spec: `docs/superpowers/specs/2026-04-08-vortix-ai-crypto-split-design.md`
Plan: `docs/superpowers/plans/2026-04-08-vortix-ai-crypto-split.md`
Worktree: `.worktrees/vortix-ai-crypto-split` (branch `feature/vortix-ai-crypto-split`)

The plan: keep ONE React+Vite app, use React Router nested layouts to split routes:
- `/` → `AILayout` (new AI brand pages, static-only, no CMS calls)
- `/crypto/*` → `CryptoLayout` (existing crypto pages, untouched, CMS-driven)
- `/blog`, `/admin`, etc. → `SharedLayout`

30+ commits landed: `feat(ai)`, `fix(ai)`, `feat(crypto)`, refactor of crypto sections with `dataOverride` props, DB `audience` column on `pr_packages`, API audience filter. The frontend portions exist in the worktree but are now **superseded** by this Next.js rebuild. Backend portions (audience column / API filter) are valid and on `main`.

### 2026-05-24 — Strategy pivot: separate Next.js app

After several rounds of trying to retrofit a new editorial-cinematic visual into the existing Vite app, Joey and I (Claude) concluded:

- The existing app has 1071+ lines of `index.css`, 30+ Radix UI primitives, and 35+ admin pages all carrying crypto-styling muscle memory. Refreshing the AI side in place leaks into Crypto styling.
- AI agents (Claude / agy / Codex) generate Next.js 16 + Tailwind v4 + RSC code at a notably higher quality than Vite SPA code (training-data weight, plus better defaults). For an editorial marketing site we want the floor higher.
- Server components let us optimize images (the painterly bgs are the heaviest assets) without client JS, which is hard inside the existing Vite setup.

So: **scaffold a fresh Next.js app, do not retrofit**. Initial mistake: scaffolded it as a standalone repo at `~/Development/vortixpr-ai/` (GitHub `darwin7381/vortixpr-ai`). This decision is documented in memory (`project_vortixpr_ai_stack.md`).

The Next.js app was then built section by section over 13+ design passes (Hero → LogoStrip → WhyVortix → Services → Packages → VortixPortal → Lyro → Trusted → Publisher → FAQ → Contact → FinalCTA → Footer). Many sections were redesigned multiple times (Services redesigned 5+ times — see `AGY-CONTEXT.md` for design constraints).

### 2026-05-25 — Monorepo merge: this app moves in

Joey reviewed the standalone repo and pushed back: there is no good reason a frontend-only Next.js app needs its own GitHub repo when the existing monorepo already has `backend/`, `frontend/`, `admin/`. Future state must share backend, brand assets, types, and one CI/deploy pipeline.

So today (2026-05-25):

1. The contents of `~/Development/vortixpr-ai/` (minus `node_modules`, `.next`, `.git`, build artifacts) were copied into `bd/a-new-pr-agency/frontend-ai/`
2. Committed on branch `feat/merge-frontend-ai-monorepo` (commit `bf37c94 feat(frontend-ai): merge vortixpr-ai Next.js site into monorepo`)
3. Architecture spec written at `docs/superpowers/specs/2026-05-25-monorepo-frontend-ai-merge.md` (commit `cf91417`)
4. Memory updated (`project_vortixpr_ai_stack.md`) to reflect new monorepo location
5. Dev server now runs from this folder; FRP tunnel `https://vortixpr-ai.tunnel.fud.city` continues to point at `localhost:3001`

Pending:
- PR merge into `main`
- Archive `darwin7381/vortixpr-ai` standalone repo on GitHub
- Delete `~/Development/vortixpr-ai/` local directory
- Deploy + reverse proxy configuration (`vortixpr.com/*` → frontend-ai; `vortixpr.com/crypto/*` → frontend; `vortixpr.com/api/*` → backend) — Joey is handling deployment separately

---

## Tech stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16.2.6 App Router** | Best RSC story for marketing, image optimization, future server-side personalization |
| UI | **React 19.2.4** | Latest stable |
| Styling | **Tailwind v4** (CSS-first via `@theme inline` in globals.css) | No JS config file; faster builds via Lightning CSS |
| Type System | TypeScript strict | |
| Fonts | Fraunces (display serif, optical sizing) / Onest (body sans) / JetBrains Mono (technical) — via `next/font/google` | Editorial cinematic voice; no Inter (banned) |
| Background imagery | painterly AI-generated landscapes in `/public/img/world-*.jpeg` | Each WorldStrip section group shares one bg |
| State/data | Static constants only — **no CMS calls** | AI-first content still in validation; YAGNI per 2026-04-08 spec section 2.2 |
| Animation | CSS-only (no Framer Motion) — `requestAnimationFrame` for marquee, `IntersectionObserver` was REMOVED in pass 7 after Joey rejected section scroll-fade-up as template-tier |
| **NOT used** | shadcn (banned per memory `feedback_no_shadcn`), Radix UI, Astro, Inter, purple, pure black `#000`, Vite |

---

## Visual system (don't break these)

**The 8-size strict type scale** (defined in `src/app/globals.css`):
- 12px (`--text-meta`) — mono eyebrow / tag
- 13px (`--text-caption`) — caption / nav / index
- 16px (`--text-body`) — body / CTA
- 18px (`--text-lead`) — lead paragraph
- 24px (`--text-h3`) — sub-heading / italic quote
- 32px — display numeral
- 36px (`--text-h2`) — section h2
- 48px (`--text-h1`) — Hero h1
- Desktop bumps via `@media` queries

**Helper classes** that bind font-family + size + line-height + tracking (`.t-display / .t-h2 / .t-h3 / .t-lead / .t-body / .t-quote / .t-num-display / .t-caption`). Use these. **DO NOT use `font-[var(--font-display)]` arbitrary classes — broken in Tailwind v4.**

**Color palette** (vars in globals.css):
- `--paper` / `--paper-muted` / `--paper-faint` — warm cream text
- `--ink` `#0E0E10` — warm dark bg (NEVER pure `#000`)
- `--accent` `#D58A4D` — warm amber for CTAs / logo / details (use SPARINGLY)
- `--gold` `#B58A2A` — editorial numerals / highlights
- `--highlight` jared `#FBE9A8` — editorial highlighter
- `--rule` / `--rule-strong` / `--rule-light` — hairlines

**Page structure** (`src/app/page.tsx`):

```
Hero (painterly hero-bg.jpeg)
LogoStrip (dark, media marquee — TechCrunch / WIRED / etc. in Fraunces italic)
WorldStrip 1: WhyVortix + Services (shared world-why-new.jpeg)
WorldStrip 2: Packages + VortixPortal (shared world-04-tall.jpeg)
Lyro (dark — cat astronaut feature, mobile-stack image-on-top)
WorldStrip 3: Trusted + Publisher + FAQ (shared world-05-trusted.jpeg)
WorldStrip 4: Contact + FinalCTA (shared world-07-tall.jpeg)
Footer (dark)
```

`WorldStrip` is the visual backbone: consecutive painterly sections MUST share one strip background to avoid visual breaks at section boundaries.

**Motion** (only initial-paint or hover-triggered, never scroll-fade-up on sections):
- Hero h1: word-by-word stagger fade-up on initial paint
- Stats: count-up from 0 via `Counter.tsx` (`requestAnimationFrame` + `easeOutExpo`)
- Cat astronaut: barely-perceptible breathing scale `1.0 ↔ 1.004` over 10s
- Eyebrow lines: hairline draws from 0 → 100% width on initial paint
- CTAs: magnetic translate + cursor-following amber radial glow via `InteractiveButton.tsx`
- LogoStrip marquee: `requestAnimationFrame` lerp loop, +18% speed on hover
- WorldStrip bgs: subtle scroll parallax `-24px ↔ 24px` (background only, content static)

**Banned design patterns** (Joey has explicitly rejected these in pass 7-11):
- Section-level scroll-fade-up reveals (template-tier; loses info on fast mobile scroll)
- Stagger reveals of body paragraph lines
- Scroll-jacked snap / pinning
- Bouncy springs / Framer-template easing
- 3-equal-column "feature card" grids
- Glassmorphic uniform card grids with rounded corners
- 2-col sticky-side-header + card-grid-on-right (the Vercel/Linear default)

---

## File map (the important ones)

```
frontend-ai/
├── src/
│   ├── app/
│   │   ├── globals.css          ← design tokens, .t-* helpers, motion keyframes, focus states
│   │   ├── layout.tsx           ← root layout, fonts, FloatingNav, RevealOnScroll (currently unused)
│   │   └── page.tsx             ← home page composition (the 13-section flow above)
│   │
│   └── components/
│       ├── layout/
│       │   ├── FloatingNav.tsx
│       │   ├── InteractiveButton.tsx     ← magnetic CTAs with cursor glow
│       │   ├── Counter.tsx                ← stats tick-up
│       │   └── RevealOnScroll.tsx         ← legacy from pass 6, no longer mounted
│       │
│       └── sections/
│           ├── Hero.tsx
│           ├── LogoStrip.tsx
│           ├── WhyVortix.tsx
│           ├── Services.tsx               ← Widescreen Editorial Dossier (pass 13)
│           ├── Packages.tsx
│           ├── VortixPortal.tsx
│           ├── Lyro.tsx
│           ├── Trusted.tsx
│           ├── Publisher.tsx
│           ├── FAQ.tsx
│           ├── Contact.tsx
│           ├── FinalCTA.tsx
│           ├── Footer.tsx
│           └── WorldStrip.tsx              ← shared painterly bg wrapper
│
├── public/img/                  ← painterly bgs (hero-bg.jpeg, world-*.jpeg, cat-astronot.jpeg)
├── AGY-CONTEXT.md               ← primer for Antigravity CLI design sessions
└── PROJECT.md                   ← this file
```

---

## How to work in this folder

1. **Dev server**: `cd frontend-ai && pnpm dev` (port 3001). Hot reload.
2. **FRP tunnel**: already wired — `https://vortixpr-ai.tunnel.fud.city` → `localhost:3001`. Joey checks this URL.
3. **Production build**: `pnpm build`. Currently no deploy — Joey handles deployment + reverse proxy separately.
4. **Backend** (for future API integration): `cd ../backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000`.

## What NOT to do

- Don't change copy text (titles, body, tags). Words are approved by the founder. Visuals (layout, hierarchy, color, spacing, motion) are open.
- Don't re-introduce banned patterns above.
- Don't bring in shadcn / Radix / Inter / pure black / purple / Astro / Vite.
- Don't separate this into its own repo — it stays in the monorepo.
- Don't break `WorldStrip` groupings or the strict 8-size type scale.

## Related docs

- `../docs/superpowers/specs/2026-04-08-vortix-ai-crypto-split-design.md` — original split spec
- `../docs/superpowers/plans/2026-04-08-vortix-ai-crypto-split.md` — original split execution plan
- `../docs/superpowers/specs/2026-05-25-monorepo-frontend-ai-merge.md` — monorepo merge spec
- `./AGY-CONTEXT.md` — Antigravity CLI session primer
- `../TAILWIND_V4_COMPLETE_RULES_AND_DIAGNOSIS.md` — Tailwind v4 gotchas
- `../README.md` — overall monorepo README
- `../PROJECT_ANALYSIS_2026-04-07.md` — full repo analysis
