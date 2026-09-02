import type { Period } from "../types";

const MONTHS = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];

export const monthKey = (iso: string): string => iso.slice(0, 7);   // -> "2026-08"

export const monthLabel = (key: string): string => {                // -> "ago 2026"
  const [y, m] = key.split("-");
  return `${MONTHS[+m - 1]} ${y}`;
};

export const dayLabel = (iso: string): string =>                    // -> "24 ago"
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });

export const periodCaption = (period: Period): string =>
  period === "all" ? "tutto il periodo" : monthLabel(period);
