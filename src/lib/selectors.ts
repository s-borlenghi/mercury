import type {
  Transaction, Stats, BreakdownSlice, TimelinePoint, Period, CategoryName,
} from "../types";
import { CATEGORIES } from "../data/categories";
import { monthKey, dayLabel } from "./format";

// Pure read models derived from the transaction list. Kept out of the
// components so they can be unit-tested in isolation.
//
// Complexity (n = number of transactions): every function is a single O(n)
// pass, except buildTimeline, which sorts once — O(n log n). All of them are
// memoized in App, so they only rerun when their inputs change.

const signed = (t: Transaction): number => (t.type === "income" ? t.amount : -t.amount);

export function totalBalance(items: Transaction[]): number {
  return items.reduce((sum, t) => sum + signed(t), 0);
}

export function buildTimeline(items: Transaction[]): TimelinePoint[] {
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  return sorted.map((t) => {
    running += signed(t);
    return { date: t.date, label: dayLabel(t.date), saldo: Math.round(running) };
  });
}

export function filterByPeriod(items: Transaction[], period: Period): Transaction[] {
  return period === "all" ? items : items.filter((t) => monthKey(t.date) === period);
}

export function computeStats(items: Transaction[]): Stats {
  let income = 0;
  let expense = 0;
  for (const t of items) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, net: income - expense };
}

export function buildBreakdown(items: Transaction[]): BreakdownSlice[] {
  const byCat: Partial<Record<CategoryName, number>> = {};
  for (const t of items) {
    if (t.type === "expense") byCat[t.cat] = (byCat[t.cat] ?? 0) + t.amount;
  }
  const total = Object.values(byCat).reduce((s, v) => s + (v ?? 0), 0) || 1;
  return (Object.entries(byCat) as [CategoryName, number][])
    .map(([cat, value]) => ({ cat, value, pct: value / total, color: CATEGORIES[cat].color }))
    .sort((a, b) => b.value - a.value);
}

export function availableMonths(items: Transaction[]): string[] {
  return [...new Set(items.map((t) => monthKey(t.date)))].sort().reverse();
}
