# Architecture

## Data Flow
receipts.json → loadData() → computeInsights() (once) → Zustand store
   → widgets subscribe via granular selectors → ReceiptCard primitives

## Module Rules
- features/ — pure functions only, no JSX, no side effects
- widgets/ — may read store, render features' output
- shared/ui — presentational primitives, a11y-first
- app/ — composition only, no business logic

## State Shape
receipts, filters {search, type}, activeView, previousView,
selectedReceiptId, viewedReceiptIds (discovery set), insights, error

## Key Decisions
1. Zustand over Context — no provider re-render chains
2. Button/article split in ReceiptCard — valid HTML, jsx-a11y clean
3. Record<id, true> for discovery set — O(1) dedupe
4. fetch + preload pairing — matched CORS mode avoids double download
