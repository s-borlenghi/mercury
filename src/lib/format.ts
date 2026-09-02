import type { Period } from "../types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const monthKey = (iso: string): string => iso.slice(0, 7);

export const monthLabel = (key: string): string => {
  const [y, m] = key.split("-");
  return `${MONTHS[+m - 1]} ${y}`;
};

export const dayLabel = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
};

export const periodCaption = (period: Period): string =>
  period === "all" ? "all time" : monthLabel(period);