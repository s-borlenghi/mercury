import type { Transaction, CategoryName } from "../types";
import { CATEGORIES } from "./categories";

let seq = 0;
const tx = (date: string, desc: string, cat: CategoryName, amount: number): Transaction => ({
  id: ++seq, date, desc, cat, amount, type: CATEGORIES[cat].type,
});

// Sample data: three months (Jun–Aug 2026) so the charts are meaningful.
export const SEED: Transaction[] = [
  tx("2026-06-01", "Stipendio giugno", "Stipendio", 2450),
  tx("2026-06-01", "Affitto", "Affitto", 780),
  tx("2026-06-03", "Bolletta luce", "Bollette", 62),
  tx("2026-06-06", "Spesa settimanale", "Spesa", 94.3),
  tx("2026-06-09", "Abbonamento treni", "Trasporti", 45),
  tx("2026-06-12", "Cena fuori", "Ristoranti", 58),
  tx("2026-06-15", "Spesa settimanale", "Spesa", 71.2),
  tx("2026-06-18", "Cinema", "Svago", 24),
  tx("2026-06-22", "Rimborso spese", "Extra", 180),
  tx("2026-06-27", "Spesa settimanale", "Spesa", 88),

  tx("2026-07-01", "Stipendio luglio", "Stipendio", 2450),
  tx("2026-07-01", "Affitto", "Affitto", 780),
  tx("2026-07-04", "Bolletta gas", "Bollette", 48),
  tx("2026-07-07", "Spesa settimanale", "Spesa", 102.5),
  tx("2026-07-10", "Benzina", "Trasporti", 60),
  tx("2026-07-14", "Pizza con amici", "Ristoranti", 42),
  tx("2026-07-19", "Concerto", "Svago", 65),
  tx("2026-07-21", "Spesa settimanale", "Spesa", 79.9),
  tx("2026-07-28", "Progetto freelance", "Extra", 520),

  tx("2026-08-01", "Stipendio agosto", "Stipendio", 2450),
  tx("2026-08-01", "Affitto", "Affitto", 780),
  tx("2026-08-05", "Spesa settimanale", "Spesa", 96),
  tx("2026-08-09", "Bolletta luce", "Bollette", 58),
  tx("2026-08-12", "Treno weekend", "Trasporti", 74),
  tx("2026-08-16", "Ristorante mare", "Ristoranti", 88),
  tx("2026-08-20", "Spesa settimanale", "Spesa", 83.4),
  tx("2026-08-24", "Museo", "Svago", 18),
];
