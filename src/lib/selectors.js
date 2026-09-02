import { CATEGORIES } from "../data/categories.js";
import { monthKey, dayLabel } from "./format.js";

// Pure read models derived from the transaction list. Kept out of the
// components so they can be unit-tested in isolation.
//
// Complexity (n = number of transactions): every function is a single O(n)
// pass, except buildTimeline, which sorts once — O(n log n). All of them are
// memoized in App, so they only rerun when their inputs change.

const signed = (t) => (t.type === "income" ? t.amount : -t.amount);

export function totalBalance(items) {
  return items.reduce((sum, t) => sum + signed(t), 0);
}

export function buildTimeline(items) {
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  return sorted.map((t) => {
    running += signed(t);
    return { date: t.date, label: dayLabel(t.date), saldo: Math.round(running) };
  });
}

export function filterByPeriod(items, period) {
  return period === "all" ? items : items.filter((t) => monthKey(t.date) === period);
}

export function computeStats(items) {
  let income = 0;
  let expense = 0;
  for (const t of items) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, net: income - expense };
}

export function buildBreakdown(items) {
  const byCat = {};
  for (const t of items) {
    if (t.type === "expense") byCat[t.cat] = (byCat[t.cat] || 0) + t.amount;
  }
  const total = Object.values(byCat).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(byCat)
    .map(([cat, value]) => ({ cat, value, pct: value / total, color: CATEGORIES[cat].color }))
    .sort((a, b) => b.value - a.value);
}

export function availableMonths(items) {
  return [...new Set(items.map((t) => monthKey(t.date)))].sort().reverse();
}
