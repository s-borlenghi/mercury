# Architecture & performance

A short write-up of how Mercury is put together and how it behaves as the data
grows. The app is small on purpose, but the structure is the same one I'd use
on a larger codebase.

## Data flow

There is a single source of truth: the list of transactions, held by the
`useTransactions` hook. Everything the UI shows is *derived* from that list —
nothing is duplicated in state.

```
transactions (state)
      │
      ▼
pure selectors  ──►  memoized derived values  ──►  components (render only)
(lib/selectors)      (useMemo in App)              (charts, cards, list)
```

The rule I followed: **state holds facts, the UI computes views.** When a
transaction is added or removed, the transactions array changes and every
derived value recomputes from it. There is no manual "also update the total,
also update the chart" — which is exactly the class of bug that state
duplication creates.

## Why the calculations are pure functions

All the math lives in `lib/selectors` as pure functions — same input, same
output, no side effects, no React. Three payoffs:

- **Testable in isolation.** `selectors.test` calls them with plain arrays and
  asserts on the result. No rendering, no mocks.
- **Readable.** Each function does one thing and the name says what.
- **Reusable.** The same function feeds a chart, a card, or a future export
  without change.

The components never calculate; they receive derived values and decide how to
display them.

## Complexity

Let `n` = number of transactions, `k` = number of categories (fixed, ≤ 8),
`m` = number of distinct months.

| Function            | Work                          | Complexity     |
| ------------------- | ----------------------------- | -------------- |
| `totalBalance`      | one reduce                    | O(n)           |
| `computeStats`      | one loop (income/expense/net) | O(n)           |
| `filterByPeriod`    | one filter                    | O(n)           |
| `buildBreakdown`    | one loop + sort of k buckets  | O(n + k log k) |
| `availableMonths`   | one pass into a Set + sort    | O(n + m log m) |
| `buildTimeline`     | sort, then one pass           | O(n log n)     |
| list view (filter + sort) | one filter + sort       | O(n log n)     |
| `useTransactions.add` | reduce over items for the next id | O(n)     |

Since `k` and `m` are tiny and bounded, the only super-linear cost is the two
sorts (the balance timeline and the transaction list). Everything else is a
single linear pass — including `add`, which is a write path rather than a
read model, so it isn't memoized: every add really does walk the list once
to find the current max id. That's fine at a few dozen or a few thousand
rows; if this were tracking years of daily transactions I'd swap it for an
id counter kept in a ref, trading the O(n) walk for O(1) at the cost of one
more piece of state to keep in sync.

## Memoization strategy

Each derived value is wrapped in `useMemo` with a precise dependency list, so it
only recomputes when its own inputs change:

- Typing in the search box updates local state in `TransactionList` and
  re-sorts **only** the visible list. It does **not** touch `totalBalance` or
  `buildTimeline`, because those don't depend on the query.
- Switching the period re-filters `periodItems` once; both the stats and the
  category breakdown read from that single filtered array, so the period is
  filtered once per change, not twice.
- Adding or removing a transaction is the only thing that invalidates the
  all-items derivations (balance, timeline, months).

The goal isn't raw speed here — with a few dozen rows everything is
sub-millisecond. The goal is **discipline**: keep the passes linear, keep the
work memoized, and never recompute something whose inputs didn't change. That
habit is what keeps a real app fast once `n` is in the thousands.

## Persistence

State is mirrored to `localStorage` by `usePersistentState`, a thin wrapper
around `useState`: it seeds from storage on first render and writes back in an
effect whenever the value changes. That means transactions survive a reload on
a static host (GitHub Pages) with no server involved. The hook is SSR/test-safe
— with no `window` it degrades to plain `useState(initial)`, which is why the
render smoke test still sees the seed data.

New ids are derived from the current maximum id rather than a module counter,
so they stay unique even after a list has been restored from storage.

## Theming

The UI is built on MUI, but `theme.tsx` replaces the default Material look
with a light and a dark variant of the same pine/sienna palette the app
already had — `createTheme` takes the mode and returns a full `Theme`, with
component overrides (`Paper`, `AppBar`, `Dialog`, buttons, inputs) so the
palette actually shows up everywhere instead of just in a few accent colors.

The chosen mode lives in a small context (`ColorModeProvider`) built the same
way as the currency context: state plus a `usePersistentState` mirror, so it
survives a reload. `AppThemeProvider` reads that mode, builds the matching
`Theme` with `useMemo`, and wraps the app in MUI's `ThemeProvider` +
`CssBaseline`. Recharts isn't a MUI component, so its own colors (the area
gradient, axis ticks, tooltip background) are read from `useTheme()` inside
`BalanceChart` and `CategoryDonut` rather than hardcoded, which is what makes
the charts follow the mode instead of staying stuck in one palette.

## Scaling roadmap

If this had to handle very large transaction histories, the next steps, roughly
in order:

1. **Debounce the search input** so filtering runs once the user pauses, not on
   every keystroke.
2. **Virtualize the transaction list** (e.g. `react-window`) so only the visible
   rows are in the DOM.
3. **Incrementally maintain the cumulative series** instead of re-sorting the
   whole history on each change (keep it sorted on insert).
4. **Move filtering/pagination to a backend** once the data no longer fits
   comfortably in memory.

None of these are needed at the current scale — adding them now would be
premature. They're written down so the growth path is explicit.
