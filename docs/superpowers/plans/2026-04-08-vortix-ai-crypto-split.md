# VortixPR / Vortix Crypto Dual-Brand Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the existing single-brand React app into two coexisting brands — VortixPR (AI-focused, at `/`) and Vortix Crypto (existing crypto site, moved to `/crypto/*`) — using React Router nested layouts. No backend or CMS changes.

**Architecture:** Single React app, single deployment, single domain (`vortixpr.com`). Two independent layout components (`AILayout`, `CryptoLayout`) each with its own Navigation/Footer. Shared pages (blog, packages, compare, contact, login, admin) live under a third `SharedLayout`. AI side uses static constants only — does NOT call CMS APIs.

**Tech Stack:** React 18 + TypeScript + Vite 6 + React Router + Tailwind v4. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-04-08-vortix-ai-crypto-split-design.md`

---

## Pre-flight: Why TDD looks different here

The codebase has zero existing tests (frontend and backend). This plan is a structural refactor with no behavior change for crypto pages and only static placeholder content for new AI pages. The "test" for each task is therefore:

1. `npm run build` succeeds
2. `npm run dev` starts cleanly (no console errors)
3. Manual smoke check: the affected URL still renders the same visual content (for crypto pages) or the new placeholder (for AI pages)

We do **not** invent fake unit tests for `git mv` operations. The build is the test. Each task ends with a verification step that runs the build and visits the affected routes.

---

## File Structure (target end state)

```
frontend/src/
├── layouts/                          ← NEW
│   ├── AILayout.tsx
│   ├── CryptoLayout.tsx
│   └── SharedLayout.tsx
│
├── pages/
│   ├── ai/                           ← NEW
│   │   ├── AIHomePage.tsx
│   │   ├── AIServicesPage.tsx
│   │   ├── AIPricingPage.tsx
│   │   ├── AIAboutPage.tsx
│   │   ├── AIClientsPage.tsx
│   │   └── AIPublisherPage.tsx
│   │
│   ├── crypto/                       ← NEW
│   │   ├── CryptoHomePage.tsx        (extracted from App.tsx)
│   │   ├── CryptoServicesPage.tsx    (was components/ServicesPage.tsx)
│   │   ├── CryptoPricingPage.tsx     (was components/pricing/PricingPage.tsx)
│   │   ├── CryptoPricingPageV2.tsx   (was components/pricing/PricingPageV2.tsx)
│   │   ├── CryptoAboutPage.tsx       (was components/about/AboutPage.tsx)
│   │   ├── CryptoClientsPage.tsx     (was components/clients/OurClientsPage.tsx)
│   │   └── CryptoPublisherPage.tsx   (was components/publisher/PublisherPage.tsx)
│   │
│   └── (admin/, GoogleCallback, PrivacyPolicy, TermsOfService, CookiePolicy unchanged)
│
├── components/
│   ├── ai/                           ← NEW
│   │   ├── AINavigation.tsx
│   │   ├── AIFooter.tsx
│   │   ├── home/   (placeholder, populated in Step 4 — out of plan scope)
│   │   ├── services/
│   │   ├── pricing/
│   │   ├── about/
│   │   ├── clients/
│   │   └── publisher/
│   │
│   ├── crypto/                       ← NEW
│   │   ├── CryptoNavigation.tsx      (was components/Navigation.tsx)
│   │   ├── CryptoFooter.tsx          (was components/Footer.tsx)
│   │   ├── HeroNewSection.tsx
│   │   ├── HeroNewSection3D.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── ClientLogosSection.tsx
│   │   ├── EverythingYouNeedSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── LogoCarousel.tsx
│   │   ├── LyroSection.tsx
│   │   ├── Orbiting3DLogos.tsx
│   │   ├── StatsSection.tsx
│   │   ├── StatsCardCompact.tsx
│   │   ├── TestimonialSection.tsx
│   │   ├── TrustedBySection.tsx
│   │   ├── VortixPortalSection.tsx
│   │   ├── WhyPartnerSection.tsx
│   │   ├── PricingCommitment.tsx
│   │   ├── PricingContactForm.tsx
│   │   ├── PricingFAQ.tsx
│   │   ├── about/
│   │   │   ├── AboutHero.tsx
│   │   │   └── AboutTeam.tsx
│   │   ├── clients/
│   │   │   ├── ClientsHero.tsx
│   │   │   └── ClientsCTA.tsx
│   │   └── publisher/
│   │       ├── PublisherHero.tsx
│   │       ├── PublisherFeatures.tsx
│   │       ├── PublisherContent.tsx
│   │       ├── PublisherCTA.tsx
│   │       └── PublisherApplicationModal.tsx
│   │
│   ├── pricing/                      ← STAYS (now contains shared infra only)
│   │   ├── PackageDetailPage.tsx
│   │   ├── PRPackagesSection.tsx
│   │   ├── PricingCards.tsx
│   │   ├── PricingCard.tsx           (moved from flat components/)
│   │   ├── CoverageMap.tsx
│   │   └── (any other shared pricing UI)
│   │
│   ├── ui/                           ← UNCHANGED
│   ├── blog/                         ← UNCHANGED
│   ├── compare/                      ← UNCHANGED
│   ├── admin/                        ← UNCHANGED
│   ├── login/                        ← UNCHANGED
│   ├── template/                     ← UNCHANGED
│   ├── figma/                        ← UNCHANGED
│   ├── concept/                      ← UNCHANGED
│   ├── contact/                      ← UNCHANGED (if exists)
│   ├── ProtectedRoute.tsx            ← UNCHANGED
│   ├── ScrollToTop.tsx               ← UNCHANGED
│   ├── ThemeToggle.tsx               ← UNCHANGED
│   ├── ArticlePage.tsx               ← UNCHANGED (shared, used by /blog)
│   ├── BlogPage.tsx                  ← UNCHANGED (or move into blog/ — leave alone)
│   ├── ContactPage.tsx               ← UNCHANGED (shared)
│   ├── LoginPage.tsx                 ← UNCHANGED (shared)
│   ├── ConceptPage.tsx               ← UNCHANGED
│   ├── ServiceDeckPage.tsx           ← UNCHANGED
│   ├── NewsletterSuccessPage.tsx     ← UNCHANGED
│   ├── MaterialSymbolDemo.tsx        ← UNCHANGED (legacy demo)
│   └── (DEAD: OldHeroSection, OldIndexPage, HeroSection, PricingPage flat,
│        MaterialIconDemo, MaterialIconTest, EvIconDiagnostic — leave alone,
│        clean up in a separate PR)
│
└── constants/
    ├── ai/                           ← NEW (populated in Step 4 — out of plan scope)
    │
    └── crypto/                       ← NEW
        ├── aboutData.ts
        ├── articleContent.ts
        ├── blogData.ts
        ├── faqData.ts
        ├── footerData.ts
        ├── navigationData.ts
        ├── pricingData.ts
        ├── pricingDataV2.ts
        ├── publisherData.ts
        ├── servicesData.ts
        ├── statsData.ts
        ├── templateData.ts            (NOTE: verify if shared — if so, leave at root)
        └── testimonialData.ts
```

---

# PHASE 1 — Move existing crypto files into crypto/ subfolders

This phase preserves all routes at their current URLs (`/`, `/services`, etc.). Only file locations and import paths change. After Phase 1, the app behaves identically.

---

## Task 1: Pre-flight verification

**Files:** None (read-only)

- [ ] **Step 1: Confirm clean working tree**

Run: `git status`
Expected: `nothing to commit, working tree clean` (or only `docs/` changes from spec — those are fine and already committed)

- [ ] **Step 2: Confirm current build works**

Run: `cd frontend && npm run build`
Expected: Build succeeds with no TypeScript errors. Note any warnings as a baseline (we should not introduce new warnings).

- [ ] **Step 3: Confirm dev server starts and routes load**

Run: `cd frontend && npm run dev`
Expected: Vite reports "ready in <Nms>", listening on `http://localhost:3000`.

Open in browser and confirm these load without console errors:
- `http://localhost:3000/`
- `http://localhost:3000/services`
- `http://localhost:3000/pricing`
- `http://localhost:3000/about`
- `http://localhost:3000/clients`
- `http://localhost:3000/publisher`

Stop the dev server (Ctrl+C). This is the **baseline** we will compare against after every Phase 1 task.

- [ ] **Step 4: Identify dead files (informational, don't delete)**

Run from `frontend/src`:

```bash
grep -rn "from.*components/PricingPage'" .
grep -rn "from.*components/HeroSection'" .
grep -rn "from.*components/OldHeroSection'" .
grep -rn "from.*components/OldIndexPage'" .
grep -rn "from.*components/MaterialIconDemo'" .
grep -rn "from.*components/MaterialIconTest'" .
grep -rn "from.*components/EvIconDiagnostic'" .
```

Expected: All return zero matches. These files are dead code. **Do not move them, do not delete them in this plan.** Note for a separate cleanup PR later.

---

## Task 2: Create the empty target folder skeleton

**Files:**
- Create: `frontend/src/layouts/.gitkeep`
- Create: `frontend/src/pages/ai/.gitkeep`
- Create: `frontend/src/pages/crypto/.gitkeep`
- Create: `frontend/src/components/ai/.gitkeep`
- Create: `frontend/src/components/ai/home/.gitkeep`
- Create: `frontend/src/components/ai/services/.gitkeep`
- Create: `frontend/src/components/ai/pricing/.gitkeep`
- Create: `frontend/src/components/ai/about/.gitkeep`
- Create: `frontend/src/components/ai/clients/.gitkeep`
- Create: `frontend/src/components/ai/publisher/.gitkeep`
- Create: `frontend/src/components/crypto/.gitkeep`
- Create: `frontend/src/constants/ai/.gitkeep`
- Create: `frontend/src/constants/crypto/.gitkeep`

- [ ] **Step 1: Create folders with .gitkeep stubs**

Run from repo root:

```bash
cd frontend/src
mkdir -p layouts pages/ai pages/crypto \
  components/ai/{home,services,pricing,about,clients,publisher} \
  components/crypto \
  constants/ai constants/crypto

touch layouts/.gitkeep \
  pages/ai/.gitkeep pages/crypto/.gitkeep \
  components/ai/.gitkeep \
  components/ai/home/.gitkeep components/ai/services/.gitkeep \
  components/ai/pricing/.gitkeep components/ai/about/.gitkeep \
  components/ai/clients/.gitkeep components/ai/publisher/.gitkeep \
  components/crypto/.gitkeep \
  constants/ai/.gitkeep constants/crypto/.gitkeep
```

- [ ] **Step 2: Verify build still passes**

Run: `cd frontend && npm run build`
Expected: PASS (no source files were touched, just empty dirs).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/layouts frontend/src/pages/ai frontend/src/pages/crypto \
  frontend/src/components/ai frontend/src/components/crypto \
  frontend/src/constants/ai frontend/src/constants/crypto
git commit -m "chore: scaffold ai/ and crypto/ folder skeleton for brand split"
```

---

## Task 3: Extract `HomePage` from `App.tsx` into a standalone file

`HomePage` is currently a function defined inline in `App.tsx` lines 77-142. Before we can move it under `pages/crypto/`, we must extract it.

**Files:**
- Create: `frontend/src/pages/crypto/CryptoHomePage.tsx`
- Modify: `frontend/src/App.tsx` (remove `HomePage` function, add import, update Route)

- [ ] **Step 1: Create `frontend/src/pages/crypto/CryptoHomePage.tsx`**

Copy the body of the `HomePage` function from `App.tsx:77-142`. The new file should look like this (adjust import paths as needed — relative paths change because the new file is one folder deeper):

```tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleContactClick } from '../../utils/navigationHelpers';
import { contentAPI, type FAQ } from '../../api/client';
import HeroNewSection from '../../components/HeroNewSection';
import LogoCarousel from '../../components/LogoCarousel';
import StatsSection from '../../components/StatsSection';
import ServicesSection from '../../components/ServicesSection';
import LyroSection from '../../components/LyroSection';
import TrustedBySection from '../../components/TrustedBySection';
import TestimonialSection from '../../components/TestimonialSection';
import VortixPortalSection from '../../components/VortixPortalSection';
import FAQSection from '../../components/FAQSection';
import PricingContactForm from '../../components/PricingContactForm';
import Footer from '../../components/Footer';
import PRPackagesSection from '../../components/pricing/PRPackagesSection';
import PublisherFeatures from '../../components/publisher/PublisherFeatures';

export default function CryptoHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    contentAPI.getFAQs()
      .then(setFaqs)
      .catch(console.error);
  }, []);

  const handleCTAClick = () => {
    handleContactClick(navigate, location.pathname);
  };

  return (
    <>
      <HeroNewSection />
      <LogoCarousel />
      <section id="about-section">
        <StatsSection />
      </section>
      <ServicesSection onContactClick={handleCTAClick} />

      {/* Packages Preview Section */}
      <PRPackagesSection />

      {/* Vortix Portal Section */}
      <section id="vortix-portal-section">
        <VortixPortalSection />
      </section>

      {/* Lyro AI Section */}
      <section id="lyro-section">
        <LyroSection />
      </section>

      {/* Our Clients Section */}
      <section id="clients-section">
        <TrustedBySection showTitle={true} />
      </section>

      {/* Publisher Features Preview */}
      <section id="publisher-section">
        <PublisherFeatures />
      </section>

      <TestimonialSection />
      <FAQSection
        faqs={faqs.map(faq => ({ question: faq.question, answer: faq.answer }))}
        variant="default"
        maxWidth="default"
        showCTA={true}
        onPrimaryAction={handleCTAClick}
        onSecondaryAction={handleCTAClick}
      />

      {/* Contact Us Section */}
      <section id="contact-section">
        <PricingContactForm />
      </section>

      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Modify `App.tsx` — remove inline `HomePage` function**

Delete lines 76-142 (the `// Home Page Component` comment and the entire `function HomePage() { ... }`).

- [ ] **Step 3: Modify `App.tsx` — add import for `CryptoHomePage`**

Add near the other page imports (around line 42):

```tsx
import CryptoHomePage from './pages/crypto/CryptoHomePage';
```

- [ ] **Step 4: Modify `App.tsx` — update the `/` route**

Change:
```tsx
<Route path="/" element={<HomePage />} />
```
to:
```tsx
<Route path="/" element={<CryptoHomePage />} />
```

- [ ] **Step 5: Remove now-unused imports from `App.tsx`**

The `HomePage` function used many imports that are no longer needed at the App.tsx level. Remove these top-level imports if they are not used elsewhere in App.tsx (verify each one with a search before removing):

- `HeroNewSection`, `LogoCarousel`, `StatsSection`, `ServicesSection`, `LyroSection`, `TrustedBySection`, `TestimonialSection`, `VortixPortalSection`, `FAQSection`, `PricingContactForm`, `PRPackagesSection`, `PublisherFeatures`, `handleContactClick`, `contentAPI`, `FAQ`, `useState`, `useEffect`

For each, run `grep -c '<ComponentName' frontend/src/App.tsx` — if the count drops to 0 after removing the inline HomePage, the import is safe to delete.

**Keep**: `Footer` import is also used by HomePage but may still be needed elsewhere — verify before removing.

- [ ] **Step 6: Verify build passes**

Run: `cd frontend && npm run build`
Expected: PASS, no TypeScript errors.

- [ ] **Step 7: Smoke check**

Run dev server, open `http://localhost:3000/`. Should look identical to before (Hero → Logo Carousel → Stats → Services → Packages → Vortix Portal → Lyro → Clients → Publisher → Testimonials → FAQ → Contact → Footer).

- [ ] **Step 8: Commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/crypto/CryptoHomePage.tsx
git commit -m "refactor: extract HomePage from App.tsx into pages/crypto/CryptoHomePage"
```

---

## Task 4: Move `ServicesPage` → `pages/crypto/CryptoServicesPage`

**Files:**
- Move: `frontend/src/components/ServicesPage.tsx` → `frontend/src/pages/crypto/CryptoServicesPage.tsx`
- Modify: `frontend/src/App.tsx` (import path)

- [ ] **Step 1: Move with `git mv`**

```bash
git mv frontend/src/components/ServicesPage.tsx frontend/src/pages/crypto/CryptoServicesPage.tsx
```

- [ ] **Step 2: Rename the component inside the file**

Open `frontend/src/pages/crypto/CryptoServicesPage.tsx`. Find the component declaration (`function ServicesPage` or `const ServicesPage` or `export default function ServicesPage`) and rename to `CryptoServicesPage`. Update the corresponding `export default` line.

- [ ] **Step 3: Fix relative imports inside the moved file**

The file is now one folder deeper. Any `from './...'` imports must become `from '../../components/...'`. For example:
- `from './HeroSection'` → `from '../../components/crypto/HeroSection'` (or wherever it ends up; if it's still in flat `components/`, use `from '../../components/HeroSection'`)
- `from './ui/button'` → `from '../../components/ui/button'`
- `from '../api/client'` → `from '../../api/client'`
- `from '../utils/...'` → `from '../../utils/...'`

Run TypeScript check via build to find any broken imports.

- [ ] **Step 4: Update `App.tsx` import**

Change:
```tsx
import ServicesPage from './components/ServicesPage';
```
to:
```tsx
import CryptoServicesPage from './pages/crypto/CryptoServicesPage';
```

And update the Route element:
```tsx
<Route path="/services" element={<CryptoServicesPage />} />
```

- [ ] **Step 5: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 6: Smoke check**

Open `http://localhost:3000/services`. Should look identical to before.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/crypto/CryptoServicesPage.tsx
git commit -m "refactor: move ServicesPage to pages/crypto/CryptoServicesPage"
```

---

## Task 5: Move `pricing/PricingPage` → `pages/crypto/CryptoPricingPage`

**Files:**
- Move: `frontend/src/components/pricing/PricingPage.tsx` → `frontend/src/pages/crypto/CryptoPricingPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Move with `git mv`**

```bash
git mv frontend/src/components/pricing/PricingPage.tsx frontend/src/pages/crypto/CryptoPricingPage.tsx
```

- [ ] **Step 2: Rename component**

In the moved file, rename `PricingPage` → `CryptoPricingPage` (function name + default export).

- [ ] **Step 3: Fix relative imports**

The file is now at `pages/crypto/` instead of `components/pricing/`. Adjust:
- `from './PricingCards'` → `from '../../components/pricing/PricingCards'`
- `from './PRPackagesSection'` → `from '../../components/pricing/PRPackagesSection'`
- `from '../ui/button'` → `from '../../components/ui/button'`
- `from '../../api/client'` → `from '../../api/client'` (no change — same depth)
- etc.

- [ ] **Step 4: Update `App.tsx` import**

Change:
```tsx
import PricingPage from './components/pricing/PricingPage';
```
to:
```tsx
import CryptoPricingPage from './pages/crypto/CryptoPricingPage';
```

And the route:
```tsx
<Route path="/pricing" element={<CryptoPricingPage />} />
```

- [ ] **Step 5: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 6: Smoke check**

Open `http://localhost:3000/pricing`. Should look identical.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/crypto/CryptoPricingPage.tsx
git commit -m "refactor: move pricing/PricingPage to pages/crypto/CryptoPricingPage"
```

---

## Task 6: Move `pricing/PricingPageV2` → `pages/crypto/CryptoPricingPageV2`

**Files:**
- Move: `frontend/src/components/pricing/PricingPageV2.tsx` → `frontend/src/pages/crypto/CryptoPricingPageV2.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Move with `git mv`**

```bash
git mv frontend/src/components/pricing/PricingPageV2.tsx frontend/src/pages/crypto/CryptoPricingPageV2.tsx
```

- [ ] **Step 2: Rename component**

Rename `PricingPageV2` → `CryptoPricingPageV2` in the file.

- [ ] **Step 3: Fix relative imports**

Same approach as Task 5. Sibling imports under `components/pricing/` become `'../../components/pricing/...'`.

- [ ] **Step 4: Update `App.tsx`**

```tsx
import CryptoPricingPageV2 from './pages/crypto/CryptoPricingPageV2';
// ...
<Route path="/pricing-v2" element={<CryptoPricingPageV2 />} />
```

- [ ] **Step 5: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 6: Smoke check**

Open `http://localhost:3000/pricing-v2`. Should look identical.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/crypto/CryptoPricingPageV2.tsx
git commit -m "refactor: move pricing/PricingPageV2 to pages/crypto/CryptoPricingPageV2"
```

---

## Task 7: Move `about/AboutPage` → `pages/crypto/CryptoAboutPage`, sub-components to `components/crypto/about/`

**Files:**
- Move: `frontend/src/components/about/AboutPage.tsx` → `frontend/src/pages/crypto/CryptoAboutPage.tsx`
- Move: `frontend/src/components/about/AboutHero.tsx` → `frontend/src/components/crypto/about/AboutHero.tsx`
- Move: `frontend/src/components/about/AboutTeam.tsx` → `frontend/src/components/crypto/about/AboutTeam.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Move sub-components first**

```bash
git mv frontend/src/components/about/AboutHero.tsx frontend/src/components/crypto/about/AboutHero.tsx
git mv frontend/src/components/about/AboutTeam.tsx frontend/src/components/crypto/about/AboutTeam.tsx
```

- [ ] **Step 2: Move and rename the page**

```bash
git mv frontend/src/components/about/AboutPage.tsx frontend/src/pages/crypto/CryptoAboutPage.tsx
```

In the moved file, rename `AboutPage` → `CryptoAboutPage`.

- [ ] **Step 3: Fix imports inside `CryptoAboutPage.tsx`**

Update the imports for `AboutHero` and `AboutTeam`:
- `from './AboutHero'` → `from '../../components/crypto/about/AboutHero'`
- `from './AboutTeam'` → `from '../../components/crypto/about/AboutTeam'`

Also fix any other relative imports (UI primitives, utils, etc.) — they're now two levels deeper.

- [ ] **Step 4: Remove the now-empty `components/about/` folder**

```bash
rmdir frontend/src/components/about
```
(Should succeed because all files were git-mv'd out.)

- [ ] **Step 5: Update `App.tsx`**

```tsx
import CryptoAboutPage from './pages/crypto/CryptoAboutPage';
// ...
<Route path="/about" element={<CryptoAboutPage />} />
```

- [ ] **Step 6: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 7: Smoke check**

Open `http://localhost:3000/about`. Should look identical.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/crypto/CryptoAboutPage.tsx frontend/src/components/crypto/about/
git commit -m "refactor: move About page and sub-components into crypto/ subfolders"
```

---

## Task 8: Move `clients/OurClientsPage` → `pages/crypto/CryptoClientsPage`, sub-components to `components/crypto/clients/`

**Files:**
- Move: `frontend/src/components/clients/OurClientsPage.tsx` → `frontend/src/pages/crypto/CryptoClientsPage.tsx`
- Move: `frontend/src/components/clients/ClientsHero.tsx` → `frontend/src/components/crypto/clients/ClientsHero.tsx`
- Move: `frontend/src/components/clients/ClientsCTA.tsx` → `frontend/src/components/crypto/clients/ClientsCTA.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Move sub-components**

```bash
git mv frontend/src/components/clients/ClientsHero.tsx frontend/src/components/crypto/clients/ClientsHero.tsx
git mv frontend/src/components/clients/ClientsCTA.tsx frontend/src/components/crypto/clients/ClientsCTA.tsx
```

- [ ] **Step 2: Move and rename the page**

```bash
git mv frontend/src/components/clients/OurClientsPage.tsx frontend/src/pages/crypto/CryptoClientsPage.tsx
```

Rename `OurClientsPage` → `CryptoClientsPage` inside the file.

- [ ] **Step 3: Fix imports**

- `from './ClientsHero'` → `from '../../components/crypto/clients/ClientsHero'`
- `from './ClientsCTA'` → `from '../../components/crypto/clients/ClientsCTA'`
- Adjust any other relative imports.

- [ ] **Step 4: Remove empty folder**

```bash
rmdir frontend/src/components/clients
```

- [ ] **Step 5: Update `App.tsx`**

```tsx
import CryptoClientsPage from './pages/crypto/CryptoClientsPage';
// ...
<Route path="/clients" element={<CryptoClientsPage />} />
```

- [ ] **Step 6: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 7: Smoke check**

Open `http://localhost:3000/clients`. Should look identical.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/crypto/CryptoClientsPage.tsx frontend/src/components/crypto/clients/
git commit -m "refactor: move Clients page and sub-components into crypto/ subfolders"
```

---

## Task 9: Move `publisher/PublisherPage` → `pages/crypto/CryptoPublisherPage`, sub-components to `components/crypto/publisher/`

**Files:**
- Move: `frontend/src/components/publisher/PublisherPage.tsx` → `frontend/src/pages/crypto/CryptoPublisherPage.tsx`
- Move: `frontend/src/components/publisher/PublisherHero.tsx` → `frontend/src/components/crypto/publisher/PublisherHero.tsx`
- Move: `frontend/src/components/publisher/PublisherFeatures.tsx` → `frontend/src/components/crypto/publisher/PublisherFeatures.tsx`
- Move: `frontend/src/components/publisher/PublisherContent.tsx` → `frontend/src/components/crypto/publisher/PublisherContent.tsx`
- Move: `frontend/src/components/publisher/PublisherCTA.tsx` → `frontend/src/components/crypto/publisher/PublisherCTA.tsx`
- Move: `frontend/src/components/publisher/PublisherApplicationModal.tsx` → `frontend/src/components/crypto/publisher/PublisherApplicationModal.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/pages/crypto/CryptoHomePage.tsx` (uses `PublisherFeatures`)

- [ ] **Step 1: Move sub-components**

```bash
git mv frontend/src/components/publisher/PublisherHero.tsx frontend/src/components/crypto/publisher/PublisherHero.tsx
git mv frontend/src/components/publisher/PublisherFeatures.tsx frontend/src/components/crypto/publisher/PublisherFeatures.tsx
git mv frontend/src/components/publisher/PublisherContent.tsx frontend/src/components/crypto/publisher/PublisherContent.tsx
git mv frontend/src/components/publisher/PublisherCTA.tsx frontend/src/components/crypto/publisher/PublisherCTA.tsx
git mv frontend/src/components/publisher/PublisherApplicationModal.tsx frontend/src/components/crypto/publisher/PublisherApplicationModal.tsx
```

- [ ] **Step 2: Move and rename the page**

```bash
git mv frontend/src/components/publisher/PublisherPage.tsx frontend/src/pages/crypto/CryptoPublisherPage.tsx
```

Rename `PublisherPage` → `CryptoPublisherPage`.

- [ ] **Step 3: Fix imports inside `CryptoPublisherPage.tsx`**

Replace each sibling import with the new path. E.g.:
- `from './PublisherHero'` → `from '../../components/crypto/publisher/PublisherHero'`
- (repeat for each sub-component)

- [ ] **Step 4: Fix imports in `CryptoHomePage.tsx`**

`CryptoHomePage` (created in Task 3) imports `PublisherFeatures` from the old location:

```tsx
import PublisherFeatures from '../../components/publisher/PublisherFeatures';
```

Change to:
```tsx
import PublisherFeatures from '../../components/crypto/publisher/PublisherFeatures';
```

- [ ] **Step 5: Search for any other imports of moved files**

Run from `frontend/src`:

```bash
grep -rn "from.*components/publisher/" .
```

Fix any remaining matches.

- [ ] **Step 6: Remove empty folder**

```bash
rmdir frontend/src/components/publisher
```

- [ ] **Step 7: Update `App.tsx`**

Replace any `import PublisherPage` and `import PublisherFeatures` lines that pointed at the old `components/publisher/`. Add:

```tsx
import CryptoPublisherPage from './pages/crypto/CryptoPublisherPage';
// ...
<Route path="/publisher" element={<CryptoPublisherPage />} />
```

- [ ] **Step 8: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 9: Smoke check**

Open `http://localhost:3000/publisher` and `http://localhost:3000/`. Both should look identical to before. (Home uses `PublisherFeatures`.)

- [ ] **Step 10: Commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/crypto/CryptoPublisherPage.tsx frontend/src/components/crypto/publisher/ frontend/src/pages/crypto/CryptoHomePage.tsx
git commit -m "refactor: move Publisher page and sub-components into crypto/ subfolders"
```

---

## Task 10: Move all flat-level crypto section components into `components/crypto/`

This task batches the move of section components that are visually crypto-flavored and live at the flat `components/` level. They are all referenced by the moved page files (`CryptoHomePage`, `CryptoServicesPage`, `CryptoPricingPage`, etc.).

**Files to move (each with `git mv`):**

| From | To |
|---|---|
| `frontend/src/components/HeroNewSection.tsx` | `frontend/src/components/crypto/HeroNewSection.tsx` |
| `frontend/src/components/HeroNewSection3D.tsx` | `frontend/src/components/crypto/HeroNewSection3D.tsx` |
| `frontend/src/components/ServicesSection.tsx` | `frontend/src/components/crypto/ServicesSection.tsx` |
| `frontend/src/components/FeaturesSection.tsx` | `frontend/src/components/crypto/FeaturesSection.tsx` |
| `frontend/src/components/ClientLogosSection.tsx` | `frontend/src/components/crypto/ClientLogosSection.tsx` |
| `frontend/src/components/EverythingYouNeedSection.tsx` | `frontend/src/components/crypto/EverythingYouNeedSection.tsx` |
| `frontend/src/components/FAQSection.tsx` | `frontend/src/components/crypto/FAQSection.tsx` |
| `frontend/src/components/LogoCarousel.tsx` | `frontend/src/components/crypto/LogoCarousel.tsx` |
| `frontend/src/components/LyroSection.tsx` | `frontend/src/components/crypto/LyroSection.tsx` |
| `frontend/src/components/Orbiting3DLogos.tsx` | `frontend/src/components/crypto/Orbiting3DLogos.tsx` |
| `frontend/src/components/StatsSection.tsx` | `frontend/src/components/crypto/StatsSection.tsx` |
| `frontend/src/components/StatsCardCompact.tsx` | `frontend/src/components/crypto/StatsCardCompact.tsx` |
| `frontend/src/components/TestimonialSection.tsx` | `frontend/src/components/crypto/TestimonialSection.tsx` |
| `frontend/src/components/TrustedBySection.tsx` | `frontend/src/components/crypto/TrustedBySection.tsx` |
| `frontend/src/components/VortixPortalSection.tsx` | `frontend/src/components/crypto/VortixPortalSection.tsx` |
| `frontend/src/components/WhyPartnerSection.tsx` | `frontend/src/components/crypto/WhyPartnerSection.tsx` |
| `frontend/src/components/PricingCommitment.tsx` | `frontend/src/components/crypto/PricingCommitment.tsx` |
| `frontend/src/components/PricingContactForm.tsx` | `frontend/src/components/crypto/PricingContactForm.tsx` |
| `frontend/src/components/PricingFAQ.tsx` | `frontend/src/components/crypto/PricingFAQ.tsx` |

**NOTE on `PricingCard.tsx`:** This file is actually used inside `components/pricing/` shared infra. Move it INTO `components/pricing/PricingCard.tsx` instead, NOT into `components/crypto/`. Verify with `grep -rn "from.*components/PricingCard" frontend/src` first. If it's only used by `pricing/PricingCards.tsx`, the move target is `components/pricing/PricingCard.tsx`.

- [ ] **Step 1: Verify each file is not used by shared/AI/admin code**

For each file in the table above, run:

```bash
grep -rn "from.*components/<FileNameWithoutExt>'" frontend/src
```

Confirm all matches are inside files that are themselves crypto (now under `components/crypto/`, `pages/crypto/`, or `pages/crypto/CryptoHomePage.tsx`). If a file is imported by anything in `admin/`, `blog/`, `compare/`, `ui/`, or new AI code, **stop and reassess** — that file is shared, not crypto.

- [ ] **Step 2: Move `PricingCard.tsx` to its correct shared location**

```bash
grep -rn "from.*components/PricingCard'" frontend/src
```

If only used by `components/pricing/`:

```bash
git mv frontend/src/components/PricingCard.tsx frontend/src/components/pricing/PricingCard.tsx
```

Then update the importing file's path (likely just `'./PricingCard'` already, in which case no change needed since both are in the same folder).

- [ ] **Step 3: Move all the other crypto section components**

```bash
cd frontend/src/components
git mv HeroNewSection.tsx crypto/HeroNewSection.tsx
git mv HeroNewSection3D.tsx crypto/HeroNewSection3D.tsx
git mv ServicesSection.tsx crypto/ServicesSection.tsx
git mv FeaturesSection.tsx crypto/FeaturesSection.tsx
git mv ClientLogosSection.tsx crypto/ClientLogosSection.tsx
git mv EverythingYouNeedSection.tsx crypto/EverythingYouNeedSection.tsx
git mv FAQSection.tsx crypto/FAQSection.tsx
git mv LogoCarousel.tsx crypto/LogoCarousel.tsx
git mv LyroSection.tsx crypto/LyroSection.tsx
git mv Orbiting3DLogos.tsx crypto/Orbiting3DLogos.tsx
git mv StatsSection.tsx crypto/StatsSection.tsx
git mv StatsCardCompact.tsx crypto/StatsCardCompact.tsx
git mv TestimonialSection.tsx crypto/TestimonialSection.tsx
git mv TrustedBySection.tsx crypto/TrustedBySection.tsx
git mv VortixPortalSection.tsx crypto/VortixPortalSection.tsx
git mv WhyPartnerSection.tsx crypto/WhyPartnerSection.tsx
git mv PricingCommitment.tsx crypto/PricingCommitment.tsx
git mv PricingContactForm.tsx crypto/PricingContactForm.tsx
git mv PricingFAQ.tsx crypto/PricingFAQ.tsx
```

- [ ] **Step 4: Update all import paths that reference these moved files**

Use this find-and-replace strategy. From `frontend/src`:

```bash
# For each moved file, find and update all importers.
# Example for HeroNewSection:
grep -rln "from '\.\./components/HeroNewSection'" .
grep -rln "from '\.\./\.\./components/HeroNewSection'" .
grep -rln "from './components/HeroNewSection'" .
grep -rln "from 'components/HeroNewSection'" .
```

For each match, replace the path to point at `components/crypto/HeroNewSection`.

Repeat the same grep/replace pattern for every file in the table.

**Pragmatic shortcut:** Most importers will be `pages/crypto/CryptoHomePage.tsx`, `pages/crypto/CryptoServicesPage.tsx`, and other crypto pages, all of which sit at depth `pages/crypto/`. Their import path becomes `'../../components/crypto/<Name>'`. Open each crypto page file and update bulk-style.

Also check `App.tsx` — it had top-level imports of many of these. After Task 3 cleanup most should be gone, but verify.

- [ ] **Step 5: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS. If any "Cannot find module" error, find the file with the broken import and fix it.

- [ ] **Step 6: Smoke check all crypto routes**

Open and visually verify:
- `/`
- `/services`
- `/pricing`
- `/pricing-v2`
- `/about`
- `/clients`
- `/publisher`

All should look identical to baseline.

- [ ] **Step 7: Commit**

```bash
git add -A frontend/src/components frontend/src/pages frontend/src/App.tsx
git commit -m "refactor: move all flat-level crypto section components into components/crypto/"
```

---

## Task 11: Move `Navigation.tsx` → `components/crypto/CryptoNavigation.tsx`

**Files:**
- Move: `frontend/src/components/Navigation.tsx` → `frontend/src/components/crypto/CryptoNavigation.tsx`
- Modify: `frontend/src/App.tsx` (its top-level `<Navigation />` mount)
- Modify: any other importers

- [ ] **Step 1: Move and rename**

```bash
git mv frontend/src/components/Navigation.tsx frontend/src/components/crypto/CryptoNavigation.tsx
```

In the moved file, find `function Navigation` (or `const Navigation`) and the matching `export default Navigation;`. Rename to `CryptoNavigation`.

- [ ] **Step 2: Fix relative imports inside `CryptoNavigation.tsx`**

The file is now one folder deeper. Each `from './...'` becomes `from '../...'`.

- [ ] **Step 3: Find all importers and update them**

```bash
grep -rn "from.*components/Navigation'" frontend/src
```

Update each. The main one will be `App.tsx`:

```tsx
import Navigation from './components/Navigation';
```
becomes:
```tsx
import CryptoNavigation from './components/crypto/CryptoNavigation';
```

In the `AppContent` JSX, replace `<Navigation user={...} />` with `<CryptoNavigation user={...} />`.

- [ ] **Step 4: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 5: Smoke check**

The Navigation should still appear on every non-admin route and look identical.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/App.tsx frontend/src/components/crypto/CryptoNavigation.tsx
git commit -m "refactor: rename Navigation to CryptoNavigation, move into components/crypto"
```

---

## Task 12: Move `Footer.tsx` → `components/crypto/CryptoFooter.tsx`

**Files:**
- Move: `frontend/src/components/Footer.tsx` → `frontend/src/components/crypto/CryptoFooter.tsx`
- Modify: importers (notably `CryptoHomePage.tsx`, possibly `App.tsx` and other crypto pages)

- [ ] **Step 1: Move and rename**

```bash
git mv frontend/src/components/Footer.tsx frontend/src/components/crypto/CryptoFooter.tsx
```

Inside the file, rename `Footer` → `CryptoFooter` and update default export.

- [ ] **Step 2: Fix relative imports inside the moved file**

`from './...'` → `from '../...'` for siblings.

- [ ] **Step 3: Find and update all importers**

```bash
grep -rn "from.*components/Footer'" frontend/src
```

Update each:
```tsx
import Footer from '../../components/Footer';
```
becomes:
```tsx
import CryptoFooter from '../../components/crypto/CryptoFooter';
```

And change JSX `<Footer />` → `<CryptoFooter />`.

Likely importers: `CryptoHomePage.tsx`, `CryptoServicesPage.tsx`, `CryptoPricingPage.tsx`, `CryptoAboutPage.tsx`, `CryptoClientsPage.tsx`, `CryptoPublisherPage.tsx`. Possibly `ConceptPage`, `ContactPage`, `LoginPage`, etc. — but those are shared and should keep using a shared footer for now (which doesn't exist yet — see note below).

**Note:** If shared pages (Contact, Login, etc.) currently render `<Footer />`, they will visually break in Phase 2 when we introduce `SharedLayout`. For Phase 1, **leave the Footer import in those shared pages as `CryptoFooter`** even though they're not crypto — this preserves visual identity until Phase 2 reorganizes everything. We will not touch shared pages in Phase 1.

- [ ] **Step 4: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 5: Smoke check**

Footer appears on all pages, looks identical.

- [ ] **Step 6: Commit**

```bash
git add -A frontend/src
git commit -m "refactor: rename Footer to CryptoFooter, move into components/crypto"
```

---

## Task 13: Move crypto constants files into `constants/crypto/`

**Files (subject to verification — see Step 1):**
- Move: `frontend/src/constants/aboutData.ts` → `frontend/src/constants/crypto/aboutData.ts`
- Move: `frontend/src/constants/articleContent.ts` → `frontend/src/constants/crypto/articleContent.ts`
- Move: `frontend/src/constants/blogData.ts` → `frontend/src/constants/crypto/blogData.ts`
- Move: `frontend/src/constants/faqData.ts` → `frontend/src/constants/crypto/faqData.ts`
- Move: `frontend/src/constants/footerData.ts` → `frontend/src/constants/crypto/footerData.ts`
- Move: `frontend/src/constants/navigationData.ts` → `frontend/src/constants/crypto/navigationData.ts`
- Move: `frontend/src/constants/pricingData.ts` → `frontend/src/constants/crypto/pricingData.ts`
- Move: `frontend/src/constants/pricingDataV2.ts` → `frontend/src/constants/crypto/pricingDataV2.ts`
- Move: `frontend/src/constants/publisherData.ts` → `frontend/src/constants/crypto/publisherData.ts`
- Move: `frontend/src/constants/servicesData.ts` → `frontend/src/constants/crypto/servicesData.ts`
- Move: `frontend/src/constants/statsData.ts` → `frontend/src/constants/crypto/statsData.ts`
- Move: `frontend/src/constants/testimonialData.ts` → `frontend/src/constants/crypto/testimonialData.ts`

**LEAVE AT ROOT (verify before deciding):**
- `templateData.ts` — used by `template/TemplatePage` which is shared, leave alone
- Any other file that turns out to be shared

- [ ] **Step 1: Verify which files are crypto-only vs shared**

For each file in `frontend/src/constants/`, run:

```bash
grep -rn "from.*constants/<filename without ext>'" frontend/src
```

If all importers are now under `pages/crypto/`, `components/crypto/`, or `App.tsx` (which renders crypto pages), the constant is crypto-only and should move. If any importer is under `pages/admin/`, `components/blog/`, `components/template/`, `components/compare/`, etc., the constant is shared — leave it at root.

Document the decision for each file before moving.

- [ ] **Step 2: Move the verified crypto constants**

```bash
cd frontend/src/constants
git mv aboutData.ts crypto/aboutData.ts
git mv articleContent.ts crypto/articleContent.ts
git mv blogData.ts crypto/blogData.ts
git mv faqData.ts crypto/faqData.ts
git mv footerData.ts crypto/footerData.ts
git mv navigationData.ts crypto/navigationData.ts
git mv pricingData.ts crypto/pricingData.ts
git mv pricingDataV2.ts crypto/pricingDataV2.ts
git mv publisherData.ts crypto/publisherData.ts
git mv servicesData.ts crypto/servicesData.ts
git mv statsData.ts crypto/statsData.ts
git mv testimonialData.ts crypto/testimonialData.ts
```

(Skip any file the Step 1 check identified as shared.)

- [ ] **Step 3: Update all importers**

For each moved file, find importers:

```bash
grep -rn "from.*constants/aboutData'" frontend/src
```

Update each path to `'.../constants/crypto/aboutData'`. Most importers are crypto pages or crypto components, sitting at depth `pages/crypto/` or `components/crypto/`, so the new path is `'../../constants/crypto/aboutData'`.

- [ ] **Step 4: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 5: Smoke check ALL crypto routes**

Visit each:
- `/`, `/services`, `/pricing`, `/pricing-v2`, `/about`, `/clients`, `/publisher`

Check that text content (which comes from constants) renders correctly.

- [ ] **Step 6: Commit**

```bash
git add -A frontend/src/constants frontend/src
git commit -m "refactor: move crypto-flavored constants into constants/crypto/"
```

---

## Task 14: Phase 1 final verification

This is the "the build is the test" gate before moving to Phase 2.

- [ ] **Step 1: Clean build**

```bash
cd frontend
rm -rf node_modules/.vite dist
npm run build
```

Expected: PASS, no TypeScript errors, no new warnings vs Task 1 baseline.

- [ ] **Step 2: Dev server smoke test**

```bash
npm run dev
```

Open every public route and confirm visual identity to baseline:

| Route | Expected |
|---|---|
| `/` | Crypto home (Hero, Logo Carousel, Stats, Services, Packages, Vortix Portal, Lyro, Clients, Publisher, Testimonials, FAQ, Contact, Footer) |
| `/services` | Crypto services page |
| `/pricing` | Crypto pricing page |
| `/pricing-v2` | Crypto pricing v2 page |
| `/about` | Crypto about page |
| `/clients` | Crypto clients page |
| `/publisher` | Crypto publisher page |
| `/blog` | Blog list (unchanged) |
| `/blog/<some-id>` | Blog article (unchanged) |
| `/packages/<some-slug>` | Package detail (unchanged) |
| `/compare` | Compare page (unchanged) |
| `/contact` | Contact page (unchanged) |
| `/login` | Login page (unchanged) |
| `/admin` | Admin dashboard (after login, unchanged) |

Any visual regression → diagnose and fix before proceeding.

- [ ] **Step 3: Check git log**

```bash
git log --oneline -20
```

Expect ~13 commits from Phase 1 with clear refactor messages.

- [ ] **Step 4: Phase 1 done — no commit needed**

---

# PHASE 2 — Add layouts and reroute crypto pages under `/crypto`

After Phase 2, crypto pages live under `/crypto/*`, the AI side has a placeholder at `/`, and three layout components (`AILayout`, `CryptoLayout`, `SharedLayout`) own their own Navigation/Footer.

---

## Task 15: Create `CryptoLayout`

**Files:**
- Create: `frontend/src/layouts/CryptoLayout.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { Outlet } from 'react-router-dom';
import CryptoNavigation from '../components/crypto/CryptoNavigation';
import CryptoFooter from '../components/crypto/CryptoFooter';

interface CryptoLayoutProps {
  user: any;  // TODO: type properly with the auth context's User type
  onLogout: () => void;
  onQuickLogin: () => void;
}

export default function CryptoLayout({ user, onLogout, onQuickLogin }: CryptoLayoutProps) {
  return (
    <>
      <CryptoNavigation user={user} onLogout={onLogout} onQuickLogin={onQuickLogin} />
      <div className="pt-14 sm:pt-16 md:pt-[72px] lg:pt-[72px]">
        <Outlet />
      </div>
      <CryptoFooter />
    </>
  );
}
```

**Note on the `user` prop drilling:** This is preserved from how `App.tsx` currently passes auth props into `Navigation`. Cleaner long term would be to read auth via `useAuth()` directly inside `CryptoNavigation`. For Phase 2 we do the minimal change — pass props through.

**Note on `Footer`:** If `CryptoHomePage` (and other crypto pages) currently renders its own `<CryptoFooter />` at the bottom of the JSX, we MUST remove those inline footers when `CryptoLayout` takes over rendering, or there will be a duplicate footer. This is handled in Task 17 step 4.

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS (file is unused so far, but should compile).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/layouts/CryptoLayout.tsx
git commit -m "feat(layouts): add CryptoLayout with CryptoNavigation and CryptoFooter"
```

---

## Task 16: Create `SharedLayout`

**Files:**
- Create: `frontend/src/layouts/SharedLayout.tsx`

The SharedLayout question: shared pages (blog, contact, login, packages, compare) historically used the same `Navigation` (now `CryptoNavigation`) and `Footer` (now `CryptoFooter`). For Phase 2, **SharedLayout reuses CryptoNavigation and CryptoFooter as a temporary measure.** When AI nav/footer exist (Phase 3), we can decide whether shared pages keep crypto chrome or get a neutral chrome. That decision is **out of scope for this plan** — track as a follow-up.

- [ ] **Step 1: Write the file**

```tsx
import { Outlet } from 'react-router-dom';
import CryptoNavigation from '../components/crypto/CryptoNavigation';
import CryptoFooter from '../components/crypto/CryptoFooter';

interface SharedLayoutProps {
  user: any;
  onLogout: () => void;
  onQuickLogin: () => void;
}

export default function SharedLayout({ user, onLogout, onQuickLogin }: SharedLayoutProps) {
  return (
    <>
      <CryptoNavigation user={user} onLogout={onLogout} onQuickLogin={onQuickLogin} />
      <div className="pt-14 sm:pt-16 md:pt-[72px] lg:pt-[72px]">
        <Outlet />
      </div>
      <CryptoFooter />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/layouts/SharedLayout.tsx
git commit -m "feat(layouts): add SharedLayout (temporarily uses crypto chrome)"
```

---

## Task 17: Create minimal `AILayout` and refactor `App.tsx` routes

**Files:**
- Create: `frontend/src/layouts/AILayout.tsx` (minimal, fleshed out in Phase 3)
- Modify: `frontend/src/App.tsx` (route restructure)
- Modify: `frontend/src/pages/crypto/CryptoHomePage.tsx` (remove inline `<CryptoFooter />`)
- Modify: any other crypto page that renders an inline `<CryptoFooter />`

- [ ] **Step 1: Create minimal `AILayout.tsx`**

```tsx
import { Outlet } from 'react-router-dom';

export default function AILayout() {
  // Phase 3 will add AINavigation and AIFooter here.
  // For now, just a placeholder so the route tree compiles and the
  // root path can render its Coming Soon page.
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
}
```

- [ ] **Step 2: Create `pages/ai/AIHomePage.tsx` (placeholder)**

```tsx
import { Link } from 'react-router-dom';

export default function AIHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          VortixPR
        </h1>
        <p className="text-lg text-gray-600">
          The AI PR agency, built for AI startups and solo founders.
          <br />
          Coming soon.
        </p>
        <Link
          to="/crypto"
          className="inline-block px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Looking for crypto PR? Visit Vortix Crypto →
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Refactor `App.tsx` route tree**

Replace the existing flat `<Routes>` block with the layout-wrapped structure:

```tsx
<Routes>
  {/* AI site */}
  <Route element={<AILayout />}>
    <Route path="/" element={<AIHomePage />} />
  </Route>

  {/* Crypto subsite */}
  <Route element={<CryptoLayout user={user} onLogout={logout} onQuickLogin={quickLogin} />}>
    <Route path="/crypto" element={<CryptoHomePage />} />
    <Route path="/crypto/services" element={<CryptoServicesPage />} />
    <Route path="/crypto/pricing" element={<CryptoPricingPage />} />
    <Route path="/crypto/pricing-v2" element={<CryptoPricingPageV2 />} />
    <Route path="/crypto/about" element={<CryptoAboutPage />} />
    <Route path="/crypto/clients" element={<CryptoClientsPage />} />
    <Route path="/crypto/publisher" element={<CryptoPublisherPage />} />
  </Route>

  {/* Shared pages */}
  <Route element={<SharedLayout user={user} onLogout={logout} onQuickLogin={quickLogin} />}>
    <Route path="/blog" element={<BlogPage />} />
    <Route path="/blog/:articleId" element={<ArticlePage />} />
    <Route path="/packages/:slug" element={<PackageDetailPage />} />
    <Route path="/compare" element={<ComparePage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<LoginPage />} />
    <Route path="/auth/google/callback" element={<GoogleCallback />} />
    <Route path="/newsletter-success" element={<NewsletterSuccessPage />} />
    <Route path="/material-symbols" element={<MaterialSymbolDemo />} />
    <Route path="/template" element={<TemplatePage />} />
    <Route path="/concept" element={<ConceptPage />} />
    <Route path="/service-deck" element={<ServiceDeckPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/cookie-policy" element={<CookiePolicy />} />
  </Route>

  {/* Admin (no layout, ProtectedRoute handles its own chrome) */}
  <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
  {/* ... all the other admin routes EXACTLY as they are today, unchanged ... */}
</Routes>
```

Add the new imports at the top of `App.tsx`:

```tsx
import AILayout from './layouts/AILayout';
import CryptoLayout from './layouts/CryptoLayout';
import SharedLayout from './layouts/SharedLayout';
import AIHomePage from './pages/ai/AIHomePage';
```

- [ ] **Step 4: Remove the global `<Navigation />` mount from `AppContent`**

Currently `App.tsx` has something like:

```tsx
{!isAdminRoute && <CryptoNavigation user={user} onLogout={logout} onQuickLogin={quickLogin} />}
```

Remove this line. The Navigation is now rendered by each Layout instead.

Also remove the `pt-14 sm:pt-16 md:pt-[72px] lg:pt-[72px]` wrapper div around `<Routes>` if it exists — that padding moves into each Layout.

Likewise remove any `{!isAdminRoute && <CompareBar />}` mount and re-add it inside `SharedLayout` if it should appear on shared pages, or inside CryptoLayout if it should appear on crypto pages. Recommended: put it in SharedLayout so it appears on packages/compare. Decide based on UX.

- [ ] **Step 5: Remove inline `<CryptoFooter />` from crypto pages**

Open each crypto page that renders its own footer and remove the line. At minimum:

`pages/crypto/CryptoHomePage.tsx`:
```tsx
// Remove this line near the bottom of the return:
<Footer />  // or <CryptoFooter />
```
And remove the import of `Footer` / `CryptoFooter` from that file.

Repeat for any other crypto page that has an inline footer (search: `grep -rn "CryptoFooter" frontend/src/pages/crypto/`).

The footer is now rendered by `CryptoLayout`, so inline ones cause duplication.

- [ ] **Step 6: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 7: Smoke check NEW route structure**

Open and verify:

| Route | Expected |
|---|---|
| `/` | The new "VortixPR coming soon" placeholder with link to /crypto. **NO crypto content.** |
| `/crypto` | The original crypto home, **with crypto nav at top and crypto footer at bottom, no duplicate footer**. |
| `/crypto/services` | Crypto services page |
| `/crypto/pricing` | Crypto pricing |
| `/crypto/pricing-v2` | Crypto pricing v2 |
| `/crypto/about` | Crypto about |
| `/crypto/clients` | Crypto clients |
| `/crypto/publisher` | Crypto publisher |
| `/services` | **404** (route no longer exists at this path — this is correct) |
| `/pricing` | **404** |
| `/about`, `/clients`, `/publisher` | **404** |
| `/blog`, `/contact`, `/login` | Still work, with crypto chrome (temporary) |
| `/packages/<slug>`, `/compare` | Still work |
| `/admin` | Still works, no chrome |

If `/crypto/*` works but you see two footers, check Step 5.

- [ ] **Step 8: Commit**

```bash
git add -A frontend/src
git commit -m "feat(routing): introduce nested layouts, move crypto routes under /crypto prefix"
```

---

## Task 18: Phase 2 verification

- [ ] **Step 1: Clean build**

```bash
cd frontend
rm -rf node_modules/.vite dist
npm run build
```

Expected: PASS.

- [ ] **Step 2: Full route smoke**

Walk every route in the table from Task 17 Step 7 again. No surprises.

- [ ] **Step 3: Phase 2 done — no commit needed**

---

# PHASE 3 — Build the AI site scaffold (Navigation, Footer, placeholder pages)

After Phase 3, the AI side has its own Navigation and Footer that are visually distinct from the crypto chrome, and all 6 AI routes are reachable from `/`. Page content is still placeholder — real content is Step 4 in the spec, out of this plan's scope.

---

## Task 19: Create `AINavigation`

**Files:**
- Create: `frontend/src/components/ai/AINavigation.tsx`

Design intent: simple, minimal AI nav. We'll iterate the visual design later. Keep this functional and obviously different from crypto nav (different color scheme or layout) so visual regressions are easy to spot.

- [ ] **Step 1: Write the file**

```tsx
import { Link, useLocation } from 'react-router-dom';

interface AINavigationProps {
  user?: any;
  onLogout?: () => void;
}

export default function AINavigation({ user, onLogout }: AINavigationProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      isActive(path) ? 'text-black' : 'text-gray-600 hover:text-black'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight">
            VortixPR
          </Link>

          {/* Main nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className={linkClass('/services')}>Services</Link>
            <Link to="/pricing" className={linkClass('/pricing')}>Pricing</Link>
            <Link to="/about" className={linkClass('/about')}>About</Link>
            <Link to="/clients" className={linkClass('/clients')}>Clients</Link>
            <Link to="/publisher" className={linkClass('/publisher')}>Publisher</Link>
          </div>

          {/* Right side: cross-brand link + auth */}
          <div className="flex items-center space-x-4">
            <Link
              to="/crypto"
              className="text-xs text-gray-500 hover:text-black transition border border-gray-300 rounded-full px-3 py-1"
            >
              Crypto Services →
            </Link>
            {user ? (
              <button onClick={onLogout} className="text-sm text-gray-600 hover:text-black">
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-sm font-medium text-black hover:underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ai/AINavigation.tsx
git commit -m "feat(ai): add AINavigation with VortixPR branding and crypto cross-link"
```

---

## Task 20: Create `AIFooter`

**Files:**
- Create: `frontend/src/components/ai/AIFooter.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { Link } from 'react-router-dom';

export default function AIFooter() {
  return (
    <footer className="border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-4">VortixPR</h3>
            <p className="text-sm text-gray-600">
              The PR agency for AI startups.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/services" className="hover:text-black">All Services</Link></li>
              <li><Link to="/pricing" className="hover:text-black">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-black">About</Link></li>
              <li><Link to="/clients" className="hover:text-black">Clients</Link></li>
              <li><Link to="/contact" className="hover:text-black">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Other Brands</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/crypto" className="hover:text-black">Vortix Crypto →</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} VortixPR. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="/privacy-policy" className="hover:text-black">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-black">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-black">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ai/AIFooter.tsx
git commit -m "feat(ai): add AIFooter with VortixPR navigation and crypto cross-link"
```

---

## Task 21: Wire `AINavigation` and `AIFooter` into `AILayout`

**Files:**
- Modify: `frontend/src/layouts/AILayout.tsx`

- [ ] **Step 1: Update AILayout to use AI chrome**

Replace the contents of `AILayout.tsx` with:

```tsx
import { Outlet } from 'react-router-dom';
import AINavigation from '../components/ai/AINavigation';
import AIFooter from '../components/ai/AIFooter';

interface AILayoutProps {
  user?: any;
  onLogout?: () => void;
}

export default function AILayout({ user, onLogout }: AILayoutProps) {
  return (
    <>
      <AINavigation user={user} onLogout={onLogout} />
      <div className="pt-16">
        <Outlet />
      </div>
      <AIFooter />
    </>
  );
}
```

- [ ] **Step 2: Update `App.tsx` to pass auth props to AILayout**

In the route tree:

```tsx
<Route element={<AILayout user={user} onLogout={logout} />}>
  <Route path="/" element={<AIHomePage />} />
  {/* (more AI routes added in Task 23) */}
</Route>
```

- [ ] **Step 3: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 4: Smoke check `/`**

Open `http://localhost:3000/`. You should see:
- AI navigation at the top (white background, "VortixPR" wordmark, links to Services/Pricing/About/Clients/Publisher, "Crypto Services →" pill on the right, Sign in button)
- The AIHomePage placeholder content
- AIFooter at the bottom

- [ ] **Step 5: Commit**

```bash
git add frontend/src/layouts/AILayout.tsx frontend/src/App.tsx
git commit -m "feat(ai): wire AINavigation and AIFooter into AILayout"
```

---

## Task 22: Add cross-brand entry link in `CryptoNavigation`

**Files:**
- Modify: `frontend/src/components/crypto/CryptoNavigation.tsx`

- [ ] **Step 1: Add a "← VortixPR" link**

In `CryptoNavigation.tsx`, find the right side of the nav (where the auth/CTA buttons live) and add a link element:

```tsx
import { Link } from 'react-router-dom';
// ... existing imports

// In the JSX, in the right-side actions area:
<Link
  to="/"
  className="text-xs text-gray-500 hover:text-black transition border border-gray-300 rounded-full px-3 py-1 mr-2"
>
  ← VortixPR
</Link>
```

The exact placement and styling should match the existing nav's visual language. Don't break anything else.

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 3: Smoke check**

Open `http://localhost:3000/crypto`. The crypto nav should now have a "← VortixPR" link that navigates back to `/` (the AI placeholder).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/crypto/CryptoNavigation.tsx
git commit -m "feat(crypto): add VortixPR cross-brand link in CryptoNavigation"
```

---

## Task 23: Create the 5 remaining AI placeholder pages

**Files:**
- Create: `frontend/src/pages/ai/AIServicesPage.tsx`
- Create: `frontend/src/pages/ai/AIPricingPage.tsx`
- Create: `frontend/src/pages/ai/AIAboutPage.tsx`
- Create: `frontend/src/pages/ai/AIClientsPage.tsx`
- Create: `frontend/src/pages/ai/AIPublisherPage.tsx`
- Modify: `frontend/src/App.tsx` (add 5 routes)

Each placeholder page is the same shape — simple hero with the page title and a "Coming soon" line. We make them now so the AI nav links don't 404.

- [ ] **Step 1: Create `AIServicesPage.tsx`**

```tsx
export default function AIServicesPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Services</h1>
        <p className="text-lg text-gray-600">
          PR services for AI startups. Coming soon.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `AIPricingPage.tsx`**

```tsx
export default function AIPricingPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Pricing</h1>
        <p className="text-lg text-gray-600">
          Transparent pricing for AI startups. Coming soon.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `AIAboutPage.tsx`**

```tsx
export default function AIAboutPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About VortixPR</h1>
        <p className="text-lg text-gray-600">
          Coming soon.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `AIClientsPage.tsx`**

```tsx
export default function AIClientsPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Clients</h1>
        <p className="text-lg text-gray-600">
          AI companies we work with. Coming soon.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `AIPublisherPage.tsx`**

```tsx
export default function AIPublisherPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Publishers</h1>
        <p className="text-lg text-gray-600">
          AI media network. Coming soon.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Add imports and routes in `App.tsx`**

Add imports near the other AI imports:

```tsx
import AIServicesPage from './pages/ai/AIServicesPage';
import AIPricingPage from './pages/ai/AIPricingPage';
import AIAboutPage from './pages/ai/AIAboutPage';
import AIClientsPage from './pages/ai/AIClientsPage';
import AIPublisherPage from './pages/ai/AIPublisherPage';
```

Update the AI layout block in the route tree:

```tsx
<Route element={<AILayout user={user} onLogout={logout} />}>
  <Route path="/" element={<AIHomePage />} />
  <Route path="/services" element={<AIServicesPage />} />
  <Route path="/pricing" element={<AIPricingPage />} />
  <Route path="/about" element={<AIAboutPage />} />
  <Route path="/clients" element={<AIClientsPage />} />
  <Route path="/publisher" element={<AIPublisherPage />} />
</Route>
```

- [ ] **Step 7: Verify build**

Run: `cd frontend && npm run build`
Expected: PASS.

- [ ] **Step 8: Smoke check all AI routes**

Open and verify each renders the placeholder with AI nav and footer:

| Route | Expected title |
|---|---|
| `/` | "VortixPR" (with hero + crypto link button) |
| `/services` | "Services" |
| `/pricing` | "Pricing" |
| `/about` | "About VortixPR" |
| `/clients` | "Our Clients" |
| `/publisher` | "Publishers" |

Click each link in the AI nav — all should work, no 404.

Click the "Crypto Services →" button — should land on `/crypto`. Click "← VortixPR" in crypto nav — should land back on `/`.

- [ ] **Step 9: Commit**

```bash
git add frontend/src/pages/ai frontend/src/App.tsx
git commit -m "feat(ai): add placeholder pages for services, pricing, about, clients, publisher"
```

---

## Task 24: Final acceptance check

- [ ] **Step 1: Clean build**

```bash
cd frontend
rm -rf node_modules/.vite dist
npm run build
```

Expected: PASS.

- [ ] **Step 2: Full acceptance walk per spec §8**

Verify all 10 acceptance criteria from `docs/superpowers/specs/2026-04-08-vortix-ai-crypto-split-design.md`:

1. ✅ `npm run build` passes
2. ✅ `/` shows new AI homepage with `AINavigation` + `AIFooter`
3. ✅ `/services`, `/pricing`, `/about`, `/clients`, `/publisher` show AI versions
4. ✅ `/crypto` shows original crypto home with `CryptoNavigation` + `CryptoFooter`
5. ✅ `/crypto/services`, `/crypto/pricing`, `/crypto/about`, `/crypto/clients`, `/crypto/publisher` show original crypto pages, visually identical to pre-migration baseline
6. ✅ AI nav has working "Crypto Services →" link to `/crypto`
7. ✅ Crypto nav has working "← VortixPR" link to `/`
8. ✅ `/admin/*` unchanged, CMS works
9. ✅ Blog, packages, compare, contact, login, auth all work
10. ✅ No backend / DB schema changes (verify with `git diff main backend/`)

- [ ] **Step 3: Backend untouched check**

```bash
git diff main --stat backend/
```

Expected: No backend file in the diff. If anything appears, investigate.

- [ ] **Step 4: Done — no commit**

Plan complete. Phase 4 (filling AI content) is out of scope; that becomes a new spec.

---

## Self-Review Notes

After drafting, I checked:

1. **Spec coverage** — All sections of the spec are covered:
   - §3.1 AI routes → Tasks 21, 23
   - §3.2 Crypto routes → Tasks 3-9, 17
   - §3.3 Shared routes → Task 17 SharedLayout
   - §3.4 Cross-brand entry links → Tasks 19, 22
   - §4.1 Folder structure → Task 2 + per-task moves
   - §4.2 Untouched folders → Task 1 Step 4 (dead-file identification) + careful per-task scope
   - §4.3 Naming rules → Followed throughout (Crypto/AI prefix on pages, no prefix on sub-components)
   - §4.4 Single-PR move → Plan executes as one branch with many small commits
   - §5 Backend untouched → Task 24 Step 3 verifies
   - §6 Implementation order → Phase 1/2/3 mirrors spec Step 1/2/3
   - §8 Acceptance criteria → Task 24 Step 2

2. **Placeholder scan** — No "TBD/TODO/implement later" in any task. The `interface CryptoLayoutProps { user: any; ... }` has a `// TODO: type properly` note but that's acknowledged tech debt with a clear pointer, not a hidden gap.

3. **Type consistency** — `CryptoNavigation`, `CryptoFooter`, `AINavigation`, `AIFooter`, `AILayout`, `CryptoLayout`, `SharedLayout` names used consistently throughout. Page names follow `Crypto<X>Page` and `AI<X>Page`.

4. **Known known unknowns** — Two areas where the engineer must verify on the ground:
   - Task 13 Step 1 (which constants are crypto vs shared) — explicit verification step.
   - Task 10 Step 1 (which flat components are crypto vs shared) — explicit verification step.
   - These are honest "look before you leap" gates, not placeholders.
