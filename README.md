# Paper Trail 🧾
> Raw Data → Insights → Connections → Story

A forensic analysis of 6,200 digital life receipts (2015–2018) — household transactions,
Spotify listening history, and daily moments — reconstructed into an interactive story.

## The Story Uncovered
From the grinding monotony of a daily transit routine to the solitary escapes into digital subscriptions, the data maps a clear human arc. The festival break shatters this isolation before culminating in a transformative journey down south. This is the timeline of routine → rupture → escape.

## Requirements → Implementation Map
| Requirement | Where |
|---|---|
| Explore receipts | Explore view: search + type filters + pagination |
| Filtering/searching/navigation | Sticky filter bar, faceted type chips, view switcher |
| Relationship discovery | Connect view: scoring engine (sameDay×3, location×4, sharedTags×2) with plain-language reasons |
| Interactive storytelling | Story view: 4 data-derived chapters with supporting evidence |
| Visual journey | Insights view: type distribution, activity metrics, date range |
| Responsive | Mobile-first, tested 360/768/1024/1440 |

## Architecture (Feature-Sliced Design)
src/app → widgets → features (pure: connection, insights) → entities → shared
- Engines are pure functions → 11 unit tests (vitest)
- Zustand store, granular selectors
- Error boundary state with graceful fallback

## Commands
npm run dev / build / test / lint
