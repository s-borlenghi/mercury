# Mercury — Personal Finance Dashboard

[![Deploy to GitHub Pages](https://github.com/s-borlenghi/mercury/actions/workflows/deploy.yml/badge.svg)](https://github.com/s-borlenghi/mercury/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

A React app for tracking income and expenses. Add or remove a transaction
and everything — balance, charts, category breakdown — recomputes in real
time.

It's small on purpose, sized to be read start to finish, but built with the
same discipline I'd bring to something bigger: a single source of truth,
pure derivations instead of duplicated state, and a theme of its own rather
than whatever a component library looks like out of the box.

UI text is in English; money is formatted with `Intl.NumberFormat` using
the selected currency's own locale (EUR follows Italian conventions, e.g.
`4452,70 €`), so amounts read naturally instead of always defaulting to
US formatting.

**Live demo:** https://s-borlenghi.github.io/mercury/

![Screenshot](docs/screenshot.png)

## Features

- Total balance with an animated count-up (serif display numerals)
- Light / dark theme, remembered across reloads
- Balance-over-time area chart
- Expense breakdown by category (donut chart)
- Add transactions through a validated dialog
- Text search and filters by period and category
- Currency switcher (EUR / USD / GBP) with live exchange-rate conversion
  (ECB rates via a free, keyless API), cached for a few hours
- Data persists across reloads in the same tab (sessionStorage); a reset
  button restores sample data, and each new tab starts clean — safe for a
  public demo link shared with strangers
- Transaction descriptions are sanitized and filtered against a profanity
  blocklist before saving
- Responsive layout, visible keyboard focus, respects `prefers-reduced-motion`

## Stack

- **React 18** — hooks, context, function components
- **TypeScript** — strict mode, checked in CI
- **MUI** — component library and theming (custom light/dark palette, no
  default Material look)
- **Vite** — dev server and build
- **Recharts** — charts
- **lucide-react** — icons
- **Vitest** — unit tests

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:5173
npm test        # run the tests
npm run typecheck  # TypeScript, no emit
npm run build   # production build in the dist/ folder
```

## Project structure

```
src/
├── App.tsx                 # composition + memoized derived state
├── main.tsx                # entry point
├── types.ts                # shared domain types
├── theme.tsx               # MUI theme (light/dark "Ledger" palette) + mode context
├── AppThemeProvider.tsx     # wires the theme + CssBaseline around <App>
├── context/
│   └── Settings.tsx        # currency + money formatter (React context)
├── components/             # UI components, one per responsibility
│   ├── Topbar.tsx          #   period tabs, currency switcher, reset, add
│   ├── Hero.tsx
│   ├── StatCards.tsx
│   ├── BalanceChart.tsx
│   ├── CategoryDonut.tsx
│   ├── TransactionList.tsx
│   └── AddForm.tsx
├── hooks/
│   ├── useTransactions.ts    # transactions state + operations
│   ├── usePersistentState.ts # useState mirrored to local/session storage
│   ├── useExchangeRates.ts   # fetches + caches live FX rates
│   └── useCountUp.ts         # number-animation hook
├── lib/
│   ├── selectors.ts        # pure calculations (totals, series, breakdown)
│   ├── format.ts           # date + period formatting
│   ├── rates.ts            # exchange-rate API client
│   └── validate.ts         # description sanitizing + profanity filter
├── data/
│   ├── categories.ts       # domain categories + swatch colors
│   ├── seed.ts             # sample data
│   └── profanity.ts        # blocklist for the description filter
└── test/
    ├── selectors.test.ts   # calculation tests
    ├── validate.test.ts    # sanitizing + profanity filter tests
    └── render.test.tsx     # render smoke test
```

## Design decisions

- **Logic separated from the UI.** Calculations live in `lib/selectors.ts` as
  pure functions: reusable, easy to read and covered by tests. Components only
  decide how data is displayed.
- **Memoized derived state.** Totals and chart series aren't duplicated in
  state — they're derived from the transactions with `useMemo`, so there's a
  single source of truth. `periodItems` is filtered once and feeds both the
  stats and the breakdown.
- **Currency in context.** The selected currency and its formatter live in a
  small React context, so any component can format money without prop drilling.
  Amounts are entered and stored in EUR; switching currency converts through
  a live rate fetched from a free, keyless FX API and cached in localStorage
  for a few hours. If the rate hasn't loaded yet (or the fetch fails), the
  raw EUR amount is shown and a tooltip on the currency picker says so,
  rather than silently mislabeling it with the wrong currency symbol.
- **Persistence without a backend.** `usePersistentState` mirrors state to
  Web Storage, so data survives reloads on a purely static host like GitHub
  Pages. Transactions use sessionStorage — this is a public demo link, so
  each new tab starts from the sample data instead of inheriting whatever a
  previous guest typed; theme and rate-cache use localStorage, since neither
  is guest-specific. It's SSR/test-safe: with no `window`, it behaves like
  plain `useState`.
- **A courtesy content filter, not a moderation system.** The Add
  Transaction form sanitizes the description (strips control/zero-width/bidi
  characters, caps length) and rejects common profanity and slurs before the
  value ever reaches state. It matches whole words after normalizing simple
  leetspeak and stretched-out spelling, so it doesn't flag ordinary text
  that happens to contain a blocked word as a substring (e.g. "class
  assignment" doesn't trip on "ass").
- **Theming, not default Material.** `theme.tsx` builds a light and a dark
  MUI theme from the same pine/sienna "Ledger" palette the app has always
  used, with its own typography, radii and component overrides — the mode
  is picked up by a small context and mirrored to localStorage. Charts read
  their colors from the active `Theme` via `useTheme`, so Recharts follows
  the mode too.

## Architecture & performance

The app keeps a single source of truth (the transactions) and derives every
view from it with memoized pure functions. Each derivation is a single `O(n)`
pass except the two sorts (balance timeline and transaction list), which are
`O(n log n)`; memoization means typing in the search box never recomputes the
balance or the timeline. Adding a transaction is the one `O(n)` write path —
`useTransactions.add` derives the next id from the current max — which is
free at this scale and called out explicitly rather than left as a surprise.

A fuller write-up — data flow, a per-function complexity table, the memoization
strategy and a scaling roadmap — is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Deploy (GitHub Pages)

The repo includes a workflow at `.github/workflows/deploy.yml` that builds and
publishes to GitHub Pages on every push to `main`.

1. Push the project to a GitHub repository.
2. In the repo, open **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually). The site publishes at
   `https://<username>.github.io/<repo-name>/`.

`vite.config.ts` uses `base: "./"`, so the build works under the repo
subpath without hardcoding the repository name.

## Possible extensions

Editing existing transactions, CSV export, monthly budgets with over-spend
alerts.

## License

MIT © 2026 [Salvatore Borlenghi](https://github.com/s-borlenghi) — see
[LICENSE.md](LICENSE.md). Built as a personal portfolio project; the sample
data is fictional.
