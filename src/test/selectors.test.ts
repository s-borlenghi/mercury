import { describe, it, expect } from "vitest";
import {
  totalBalance, computeStats, buildBreakdown, filterByPeriod, availableMonths,
} from "../lib/selectors";
import type { Transaction } from "../types";

const sample: Transaction[] = [
  { id: 1, date: "2026-07-01", desc: "Salary", cat: "Salary", amount: 2000, type: "income" },
  { id: 2, date: "2026-07-03", desc: "Rent", cat: "Rent", amount: 700, type: "expense" },
  { id: 3, date: "2026-08-05", desc: "Groceries", cat: "Groceries", amount: 100, type: "expense" },
];

describe("selectors", () => {
  it("totalBalance adds income and subtracts expenses", () => {
    expect(totalBalance(sample)).toBe(1200);
  });

  it("computeStats returns income, expense and net", () => {
    expect(computeStats(sample)).toEqual({ income: 2000, expense: 800, net: 1200 });
  });

  it("filterByPeriod filters by month", () => {
    expect(filterByPeriod(sample, "2026-08")).toHaveLength(1);
    expect(filterByPeriod(sample, "all")).toHaveLength(3);
  });

  it("availableMonths returns months most recent first", () => {
    expect(availableMonths(sample)).toEqual(["2026-08", "2026-07"]);
  });

  it("buildBreakdown sorts expenses by amount and computes percentages", () => {
    const b = buildBreakdown(sample);
    expect(b[0].cat).toBe("Rent");
    expect(b[0].value + b[1].value).toBe(800);
    expect(Math.round(b[0].pct * 100)).toBe(88);
  });
});