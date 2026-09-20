# Paper Trail 🧾

> **Raw Data → Insights → Connections → Story**

Paper Trail transforms 4,464 digital life receipts (2015–2018 — household transactions,
Spotify listening history, and daily moments) into a forensic, interactive narrative.
Built for the WebRush 6-hour frontend hackathon.

## 🔗 Live Demo
[https://paper-trail-ivory.vercel.app/](https://paper-trail-ivory.vercel.app/)

## 📖 The Story Uncovered
Four chapters emerge from forensic analysis of the data:
1. **The Commute Routine** — 47 repeated transit receipts reveal a grinding daily cycle
2. **The Subscription Era** — Netflix, Tata Sky, mobile data: solitary digital evenings
3. **The Festival Break** — Ganesh Pujan purchases shatter the monotony (Sept 2018)
4. **The Journey South** — ropeways, temples, tea: one day of escape in Jan 2015

The arc: routine → rupture → escape.

## ✅ Requirements → Implementation Map
| Requirement | Implementation |
|---|---|
| Explore life receipts | Explore view: 4,464 receipts, search, faceted type filters, sort (date/title), 50-per-page pagination |
| Filtering, searching, navigation | Sticky filter bar, type chips with aria-pressed, sort select, four-mode view switcher with aria-current |
| Relationship discovery mechanism | Connect view: deterministic scoring engine (sameDay×3, location×4, sharedTags×2) with plain-language reasons and strength bars |
| Interactive storytelling | Story view: 4 data-derived chapters, scroll-triggered reveals, evidence cards that deep-link into Connect |
| Clear visual representation of journey | Insights view: type distribution bars, activity heatmap, top artist/category, late-night index, spend totals, most-active day |
| Responsive design | Mobile-first, 4 breakpoints, touch targets ≥36px, horizontally scrollable filter chips |

## 🏗️ Architecture
Feature-Sliced Design — dependencies flow one direction only:

```
src/
├── app/          # Composition root: layout, view routing, error boundary
├── pages/        # Page compositions (HomePage)
├── widgets/      # Ledger, TheWeb, TheThread, InsightsDashboard (view layer)
├── features/     # connection/, insights/ — PURE functions, fully unit-tested
├── entities/     # Receipt + DataInsights domain models
├── shared/       # Zustand store, ReceiptCard UI primitive
└── data/         # Normalized receipts.json
```

- **Pure engine layer** (`features/`) has zero React imports → trivially testable
- **Store** (`shared/store`) holds all state; widgets consume via granular selectors
- **ReceiptCard** renders as `<button>` when interactive, `<article>` when display-only
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for data flow diagrams.

## ⚙️ How the Connection Engine Works
`findConnections(target, all)` scores every other receipt:
`score = sameDay(×3) + sameLocation(×4) + sharedNonTypeTags(×2)`
Top 10 results with human-readable explanations ("Happened on the exact same day •
Shared keyword: transit"). Fully deterministic — 5 unit tests.

## ♿ Accessibility
Semantic landmarks, skip-to-content link, aria-current nav, aria-live counters,
aria-pressed filters, keyboard-complete card grid, visible focus rings (#b91c1c —
works on light and dark), prefers-reduced-motion via MotionConfig + CSS,
WCAG AA-verified contrast (gray-600 on cream = 6.7:1).

## ⚡ Performance
- PWA with service-worker precaching (vite-plugin-pwa, autoUpdate)
- Code-split views via React.lazy + Suspense
- Data preloaded via `<link rel="preload">`, fetched once, parsed once
- 50-DOM-node pagination; insights computed once and cached in store
- Zero web fonts — system font stack + one mono stack

## 🧪 Testing
12 unit tests (vitest, jsdom): connection scoring (5) + insights aggregation (7).
```bash
npm run test   # all tests
npm run lint   # eslint + jsx-a11y, zero warnings
npm run build  # tsc -b strict + vite production build
```

## 🛠️ Tech Stack
React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 4 · Zustand 5 ·
Framer Motion 13 · date-fns · lucide-react · Vitest · vite-plugin-pwa

## 🚀 Getting Started
```bash
npm install && npm run dev    # http://localhost:5173
npm run build && npm run preview
```

## 📊 Dataset
Three sources normalized into one `Receipt` model: Spotify history (2,000 sampled
tracks, 2018), household transactions (2,461 entries, 2015–2018), synthetic bridges (3).
Processed offline into `public/receipts.json` / `src/data/receipts.json`.
