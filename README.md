# Mercury — Personal Finance Dashboard

A React application for tracking income and expenses. Add or remove a
transaction and everything — balance, charts and category breakdown —
recomputes in real time.

UI text is in English; money is formatted with `Intl.NumberFormat` using
the selected currency's own locale (EUR follows Italian conventions, e.g.
`4452,70 €`), so amounts read naturally instead of always defaulting to
US formatting.

**Live demo:** https://s-borlenghi.github.io/mercury/

![Screenshot](docs/screenshot.png)

## Skills demonstrated

- React 18 with hooks and context — no external state library, state kept
  minimal and derived data memoized
- TypeScript in strict mode, front to back (components, hooks, selectors)
- Unit and render tests with Vitest, run in CI on every push
- Data-visualization work with Recharts (custom tooltips, gradients, a donut
  chart with a computed center label)
- Complexity-aware design: derived values are documented and kept linear —
  see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Static-site deployment via GitHub Actions, no backend required
- Accessibility basics: labelled controls, keyboard focus, `prefers-reduced-motion`

## Features

- Total balance with an animated count-up (serif display numerals)
- Balance-over-time area chart
- Expense breakdown by category (donut chart)
- Add transactions through a validated form
- Text search and filters by period and category
- Currency switcher (EUR / USD / GBP) via React context
- Data persists across reloads (localStorage), with a reset to sample data
- Responsive layout, visible keyboard focus, respects `prefers-reduced-motion`

## Stack

- **React 18 + TypeScript** (hooks, context, function components)
- **Vite** — dev server and build
- **Recharts** — charts
- **lucide-react** — icons
- **Vitest** — unit tests
- **TypeScript** — strict mode, checked in CI

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
├── styles.css              # "Ledger" theme (pine + sienna on cool paper)
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
│   ├── usePersistentState.ts # useState mirrored to localStorage
│   └── useCountUp.ts         # number-animation hook
├── lib/
│   ├── selectors.ts        # pure calculations (totals, series, breakdown)
│   └── format.ts           # date + period formatting
├── data/
│   ├── categories.ts       # domain categories + swatch colors
│   └── seed.ts             # sample data
└── test/
    ├── selectors.test.ts   # calculation tests
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
  Switching currency reformats the same amounts; it does not apply FX rates.
- **Persistence without a backend.** `usePersistentState` mirrors state to
  localStorage, so transactions survive reloads on a purely static host like
  GitHub Pages. It's SSR/test-safe: with no `window`, it behaves like plain
  `useState`.
- **Hand-written styles.** No CSS framework — the palette, spacing and layout
  are defined in a single stylesheet.

## Architecture & performance

The app keeps a single source of truth (the transactions) and derives every
view from it with memoized pure functions. Each derivation is a single `O(n)`
pass except the two sorts (balance timeline and transaction list), which are
`O(n log n)`; memoization means typing in the search box never recomputes the
balance or the timeline.

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

Editing existing transactions, CSV export, real currency conversion with
live FX rates, monthly budgets with over-spend alerts.
