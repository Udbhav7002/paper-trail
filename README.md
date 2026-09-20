# Paper Trail 🧾

> **Raw Data → Insights → Connections → Story**

Paper Trail transforms disconnected digital life receipts into a meaningful, interactive narrative. Built for the WebRush 6-hour hackathon.

## 🔗 Live Demo

[View Deployed App](https://paper-trail-ivory.vercel.app/)

---

## 📖 Concept

The challenge explicitly warns: *"A simple chronological list of receipts is not enough."*

Paper Trail is a **forensic detective board** with four distinct modes:

| Mode | Purpose |
|---|---|
| **Explore** | Browse, search, and filter all receipts with faceted controls |
| **Connect** | Click any receipt → the connection engine surfaces related moments and explains *why* they are linked |
| **Story** | A guided narrative with 4 hand-curated chapters derived from actual dataset patterns |
| **Insights** | Aggregate statistics: top artist, spending breakdown, late-night activity, type distribution |

### The Connection Engine

When you click a receipt, a scoring algorithm evaluates every other receipt:

```
score = sameDay × 3 + sameLocation × 4 + sharedTags × 2
```

The top 10 connections are displayed with plain-language explanations like *"Happened on the exact same day"* or *"Happened at the same location"*.

Both the connection engine and insights engine use consistent raw-string date parsing (`timestamp.split('T')[0]`) to avoid UTC timezone drift bugs.

### The Story

Four chapters derived from forensic analysis of the data:

1. **The Commute Routine** — repeated transit receipts revealing a grinding daily cycle
2. **The Subscription Era** — digital service purchases showing solitary connected evenings
3. **The Festival Break** — Ganesh Pujan purchases that shattered the monotony
4. **The Journey South** — A day of ropeways, temples, and tea from 2015

---

## 🏗️ Architecture

Strict **Feature-Sliced Design** for maximum modularity:

```
src/
├── app/              # Root component, routing shell, data bootstrap
├── entities/         # Receipt type definitions, DataInsights interface
├── features/         # connectionEngine.ts, insightsEngine.ts (pure logic + tests)
├── widgets/          # Ledger, TheWeb, TheThread, InsightsDashboard
├── shared/
│   ├── store/        # Zustand global state
│   └── ui/           # ReceiptCard (memoized, conditionally interactive)
└── data/             # Pre-processed receipts.json
```

### Key Decisions

- **Zustand** over Context API → granular selectors prevent unnecessary re-renders
- **Dynamic import** for `receipts.json` → main bundle stays lean; data loads separately
- **Pagination** (50 per page) → DOM stays lean, scroll stays smooth
- **`previousView` in store** → Back button always returns to the view you came from, not hardcoded Explore
- **Pure computation** → `insightsEngine.ts` runs once on data load, result cached in store
- **Conditional interactivity** → `ReceiptCard` only gets `role="button"` + keyboard handlers when `onClick` is provided; display-only cards are plain `<article>` elements

---

## ♿ Accessibility

- Semantic HTML: `<main>`, `<nav>`, `<article>`, `<section>`, `<time>`, `<footer>`
- Skip-to-content link (`:focus-visible` always visible)
- `aria-current="page"` on active navigation button (no broken `tablist` semantics)
- `aria-pressed` on filter buttons
- `aria-live="polite"` on dynamic counters and result counts
- `aria-label` on every interactive element
- `aria-hidden="true"` on decorative icons
- Global `:focus-visible` ring uses `#b91c1c` (red-700) — visible on both cream backgrounds and dark button surfaces
- `prefers-reduced-motion` handled at two layers: CSS media query + `<MotionConfig reducedMotion="user">` at root (covers Framer Motion inline JS animations)
- Color contrast: text on cream backgrounds uses `gray-600` or darker (6.70:1), text on white card backgrounds uses `gray-500` (4.68:1) — both exceed WCAG 2.1 AA minimum of 4.5:1

---

## ⚡ Performance

- **Code splitting**: JSON data loaded via `import()`, not bundled with JS
- **Lazy pagination**: only 50 DOM nodes rendered at a time
- **Granular Zustand selectors**: components subscribe only to the state slices they need
- **Memoized filtering**: `useMemo` on filtered receipt list in Ledger

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript (strict mode) | Type safety |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| Zustand 5 | State management |
| Framer Motion 13 | Animations (respects `prefers-reduced-motion`) |
| Lucide React | Icons |
| date-fns | Date formatting |
| Vitest | Unit testing |
| ESLint 9 + jsx-a11y | Linting + a11y lint rules |

---

## 🚀 Getting Started

```bash
npm install
npm run dev        # Development server
npm run build      # Production build
npm run test       # Run unit tests
npm run lint       # Lint (strict, 0 warnings)
npx tsc --noEmit   # Type-check
```

---

## 📊 Dataset

The app processes two source datasets into a unified `Receipt` format:

- **Spotify listening history** (21MB CSV → music receipts)
- **Daily household transactions** (2015–2018, purchase receipts)

All data is pre-processed by `process_data.js` into `src/data/receipts.json`.

---

## 🧪 Testing

Two pure engine modules are fully covered:

- `src/features/connectionEngine.test.ts` — 5 tests covering same-day linking, self-exclusion, location ranking, tag matching, and result cap
- `src/features/insightsEngine.test.ts` — 6 tests covering total count, top artist, late-night counting, undefined-tag guard, most active day, and type distribution

```bash
npm run test
```

---

Built with precision for WebRush.
