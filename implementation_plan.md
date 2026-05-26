# Revoluções Industriais & SENAI — 5 New Sections Implementation Plan

## Overview

The existing SPA has a Hero section (space-themed placeholder content in English) and a Capabilities section (also space-themed). This plan performs a **strict content audit**, replaces all out-of-context copy with pt-BR content about the Four Industrial Revolutions and SENAI Sorocaba, and adds 5 new cinematic scroll sections driven by GSAP ScrollTrigger + Lenis smooth scroll.

---

## User Review Required

> [!IMPORTANT]
> The existing `App.tsx` contains two sections with entirely **off-theme English content** (Mars voyage, astronaut crew registration, Helium-3 engines). The "Content Audit" requires replacing this copy wholesale with Industrial Revolutions / SENAI pt-BR content. This means:
> - The Hero badge reads: *"As Quatro Revoluções Industriais"* instead of *"Maiden Crewed Voyage to Mars"*
> - The H1 reads something like: *"O Futuro foi Forjado na Indústria"*
> - Stats cards show industrial milestones (e.g., 1760 — Primeira Revolução)
> - The modal becomes a "Visite o SENAI" / open-house registration form
> - The Capabilities section becomes an industrial timeline teaser

> [!WARNING]
> The project uses **Tailwind CSS v4** (via `@tailwindcss/vite`) and **Motion (Framer Motion v12)**. GSAP and Lenis are **not yet installed**. The plan includes installing them via npm. The integration will co-exist with the existing Motion library — GSAP handles scroll-driven entrance animations for the new sections while Motion handles modals/notifications (as already coded).

> [!CAUTION]
> The public/ assets use `.png` extension for `1revday` and `2rev` (not `.jpeg` as specified in the brief). The plan uses the **actual filenames** found on disk: `1revday.png`, `2rev.png`. All video sources are confirmed as `.mp4`.

---

## Open Questions

> [!IMPORTANT]
> **Lenis version**: The latest Lenis (`@studio-freight/lenis`) is now published under `lenis` (v1.x). Should I install `lenis` (new official package) or `@studio-freight/lenis` (legacy)? **Defaulting to `lenis`** (the canonical, maintained package).

> [!IMPORTANT]
> **Hero/Capabilities rewrite scope**: The existing code has a crew reservation modal and card click info popups. Should I keep that modal as a "Agende uma Visita ao SENAI" registration form (repurposed), or remove it entirely? **Defaulting to repurposing it** as a SENAI open-house visit scheduler — keeps the interaction but with correct content.

---

## Architecture Decisions

### State Management
- Keep existing React state (isDayMode, isPullingDown, etc.)
- Add a `sectionRefs` map for GSAP ScrollTrigger targets
- GSAP + Lenis initialized in a `useEffect` on mount, cleaned up on unmount

### GSAP Integration Pattern
```
useEffect(() => {
  // Initialize Lenis
  const lenis = new Lenis({ duration: 1.2, easing: ... });
  
  // GSAP ticker bridge
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  
  // ScrollTrigger animations per section
  // ...
  return () => { lenis.destroy(); ScrollTrigger.killAll(); };
}, []);
```

### Section Background Strategy
- Each new section is **self-contained** with its own `<video>` or `<div style="background-image">` absolutely positioned, unlike the Hero which uses a global fixed background
- Day/Night toggle applies a class swap on the section wrapper and shows/hides the appropriate media element

---

## Proposed Changes

### 1. Dependencies

#### [MODIFY] [package.json](file:///c:/Users/Bruno/OneDrive/Área de Trabalho/project/senai-prj-2/package.json)
- Add `gsap` (^3.12.x) and `lenis` (^1.x) to `dependencies`

---

### 2. CSS Design System

#### [MODIFY] [index.css](file:///c:/Users/Bruno/OneDrive/Área de Trabalho/project/senai-prj-2/src/index.css)
- Add section container styles (`.section-container`, `.section-bg`, `.section-content`)
- Add theme utility classes (`.theme-dark`, `.theme-light`)
- Add GSAP entrance animation base states (`.anim-hidden`, `.anim-visible`)
- Add timeline card and SENAI legacy styles
- Add `@media (prefers-reduced-motion)` guards
- Fix the existing typo: `-pull-easing` / `-return-easing` (missing `--` prefix) — these are dead declarations in current CSS

---

### 3. Main App Component (Full Rewrite + Additions)

#### [MODIFY] [App.tsx](file:///c:/Users/Bruno/OneDrive/Área de Trabalho/project/senai-prj-2/src/App.tsx)

**Content Audit — Hero Section:**
| Before (placeholder) | After (pt-BR, on-theme) |
|---|---|
| Badge: "Maiden Crewed Voyage to Mars Arrives 2026" | Badge: "A Jornada da Industrialização Brasileira" |
| H1: "Venture Past Our Sky Across the Universe" | H1: "O Futuro foi Forjado na Indústria" |
| Subheading: space voyage copy | "Quatro revoluções que moldaram o mundo e prepararam o SENAI Sorocaba para liderar a próxima." |
| CTA: "Claim Your Berth" | CTA: "Conhecer o SENAI" |
| Stats: 260M km / 180 Days | Stats: "1760 — 1ª Revolução" / "75+ Anos SENAI" |
| Partners: NASA, ESA, JAXA, SENAI | Partners: SENAI, FIESP, CNI, MEC |

**Content Audit — Capabilities Section:**
| Before | After |
|---|---|
| "Engineering the Interplanetary Future" | "As Quatro Eras que Transformaram a Indústria" |
| Cards: Astrodynamics, Atmospheric Shielding, Helium-3 | Cards: Mecanização, Eletricidade em Escala, A Era Digital |
| Card details: space mission specs | Industrial revolution milestones |

**Modal Repurposing:**
- Title: "Credenciamento Ares Voyage" → "Agende sua Visita ao SENAI"
- Form fields adapted to visitor registration (nome, curso de interesse)

**5 New Sections Added (after the existing Capabilities section):**

1. **`#revolucao-1`** — A Primeira Revolução Industrial
   - Background: `1revnight.mp4` (dark) / `1revday.png` (light)
   - Layout: Split — large typographic year "1760" on left, content on right
   - Key stats: Teares mecânicos, Máquina a vapor, Carvão mineral

2. **`#revolucao-2`** — A Segunda Revolução Industrial
   - Background: `2revnight.mp4` (dark) / `2rev.png` (light)
   - Layout: Centered hero with floating stat pills
   - Key stats: Eletricidade, Linha de montagem, Aço e petróleo

3. **`#revolucao-3`** — A Terceira Revolução Industrial
   - Background: `3revnight.mp4` (dark) / `3revday.mp4` (light)
   - Layout: Full-bleed with content bottom-anchored (cinema style)
   - Key stats: Computadores, Automação, Internet

4. **`#industria-4`** — A Indústria 4.0
   - Background: `4revnight.jpeg` (dark) / `4rev.jpeg` (light)
   - Layout: Two-column — content left, animated feature grid right
   - Key stats: IA, IoT, Gêmeos Digitais, Computação em Nuvem

5. **`#legado-senai`** — O Legado do SENAI Sorocaba
   - Background: Pure black `#000000`
   - Layout: Cinematic centered, large SENAI wordmark, timeline of milestones
   - Ends with a CTA to visit `sorocaba.sp.senai.br`

**Navigation Update:**
- Add all 5 new section IDs to the nav items array and IntersectionObserver

**GSAP/Lenis Logic:**
- Lenis smooth scroll initialized on mount
- GSAP ScrollTrigger entrance: each section's `.content-wrapper` children animate in with `from: { opacity:0, y:60 }` → staggered `0.15s` delays
- `will-change: transform, opacity` applied via GSAP `set()` before animations

---

## Verification Plan

### Automated / Build
- Run `npm run lint` (TypeScript check) — must pass with 0 errors
- Run `npm run dev` — dev server must start cleanly

### Manual Visual Verification
- Scroll through all 7 sections (Hero + Capabilities + 5 new)
- Toggle Day/Night on each section — correct media shown
- All entrance animations fire on scroll into view
- Nav links scroll to correct sections
- Mobile menu includes new nav items
- Modal opens with pt-BR SENAI content
- `prefers-reduced-motion: reduce` disables animations
