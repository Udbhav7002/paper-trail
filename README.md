# Paper Trail

*4,464 digital receipts from one person's life (2015–2018), presented as a browsable, searchable story.*

Paper Trail is a React data-viz narrative app built for the WebRush 6-hour frontend hackathon. It takes household transactions, Spotify listening history, and a few bridging notes, and presents them in four views: an explore table, a connection finder, a data-derived story, and an insights dashboard.

Live demo: [https://paper-trail-ivory.vercel.app/](https://paper-trail-ivory.vercel.app/)

## The data

Three sources, normalized into a single `Receipt` model and shipped as `public/receipts.json` (mirrored in `src/data/`):

- Household transactions: 2,461 entries, 2015–2018
- Spotify listening history: 2,000 sampled tracks, 2018
- 3 synthetic bridging entries (notes, messages, searches) to connect the timeline

## The story

The Story view derives four chapters from the data:

1. The Commute Routine — the same transit purchases repeated 47 times show a daily cycle
2. The Subscription Era — Netflix, Tata Sky, mobile data: solitary digital evenings
3. The Festival Break — Ganesh Pujan purchases in September 2018 break the routine
4. The Journey South — one day in January 2015: ropeways, temples, tea

The arc: routine → rupture → escape. Each chapter's evidence cards deep-link into the Connect view.

## Requirements map

| Requirement | Implementation |
|---|---|
| Explore life receipts | Explore view: search, faceted type filters, sort by date or title, 50-per-page pagination |
| Filtering, searching, navigation | Sticky filter bar, type chips with aria-pressed, sort select, four-mode view switcher with aria-current |
| Relationship discovery | Connect view: deterministic scoring engine with plain-language reasons and strength bars |
| Interactive storytelling | Story view: four data-derived chapters, scroll-triggered reveals, evidence cards that deep-link into Connect |
| Visual overview of the data | Insights view: type distribution bars, activity heatmap, top artist/category, late-night index, spend totals, most-active day |
| Responsive design | Mobile-first, four breakpoints, touch targets ≥ 36px, horizontally scrollable filter chips |

## Connection scoring

`findConnections(target, all)` scores every other receipt:

```
score = sameDay(×3) + sameLocation(×4) + sharedNonTypeTags(×2)
```

It returns the top 10 results with human-readable explanations ("Happened on the exact same day • Shared keyword: transit"). Fully deterministic, covered by unit tests.

## Architecture

Feature-Sliced Design — dependencies flow one direction only:

```
src/
├── app/          # Composition root: layout, view routing, error boundary
├── pages/        # Page compositions (HomePage)
├── widgets/      # Ledger, TheWeb, TheThread, InsightsDashboard (view layer)
├── features/     # connection/, insights/ — pure functions, fully unit-tested
├── entities/     # Receipt + DataInsights domain models
├── shared/       # Zustand store, ReceiptCard UI primitive
└── data/         # Normalized receipts.json
```

- `features/` has no React imports, so the engines are pure, testable functions.
- The Zustand store in `shared/` holds all state; widgets consume it through granular selectors.
- ReceiptCard renders as `<button>` when interactive, `<article>` when display-only.
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for data-flow diagrams.

## Accessibility and performance

- Semantic landmarks, skip-to-content link, aria-current nav, aria-live counters, aria-pressed filters, keyboard-complete card grid, visible focus rings.
- WCAG AA-verified contrast (gray-600 on cream = 6.7:1); `prefers-reduced-motion` handled via MotionConfig and CSS.
- PWA with service-worker precaching (vite-plugin-pwa), code-split views via React.lazy + Suspense.
- Data preloaded via `<link rel="preload">`, fetched once, parsed once; 50-DOM-node pagination; insights computed once and cached in the store.
- No web fonts — system font stack plus one mono stack.

## Testing

12 unit tests (Vitest + jsdom): 5 for connection scoring, 7 for insights aggregation.

```bash
npm run test    # all tests
npm run lint    # eslint + jsx-a11y, zero warnings
npm run build   # tsc -b strict + vite production build
```

## Getting started

```bash
npm install && npm run dev    # http://localhost:5173
npm run build && npm run preview
```

Tech stack: React 19, TypeScript (strict), Vite 8, Tailwind CSS 4, Zustand 5, Framer Motion 13, date-fns, lucide-react, Vitest, vite-plugin-pwa.

## License

MIT — see [LICENSE](LICENSE).
