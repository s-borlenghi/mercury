import type { Transaction, CategoryName } from "../types";
import { CATEGORIES } from "./categories";

let seq = 0;
const tx = (date: string, desc: string, cat: CategoryName, amount: number): Transaction => ({
  id: ++seq, date, desc, cat, amount, type: CATEGORIES[cat].type,
});

export const SEED: Transaction[] = [
  tx("2026-06-01", "June Salary", "Salary", 2450),
  tx("2026-06-01", "Rent", "Rent", 780),
  tx("2026-06-03", "Electricity Bill", "Bills", 62),
  tx("2026-06-06", "Weekly Groceries", "Groceries", 94.3),
  tx("2026-06-09", "Train Pass", "Transport", 45),
  tx("2026-06-12", "Dinner Out", "Restaurants", 58),
  tx("2026-06-15", "Weekly Groceries", "Groceries", 71.2),
  tx("2026-06-18", "Cinema", "Leisure", 24),
  tx("2026-06-22", "Expense Reimbursement", "Extra", 180),
  tx("2026-06-27", "Weekly Groceries", "Groceries", 88),

  tx("2026-07-01", "July Salary", "Salary", 2450),
  tx("2026-07-01", "Rent", "Rent", 780),
  tx("2026-07-04", "Gas Bill", "Bills", 48),
  tx("2026-07-07", "Weekly Groceries", "Groceries", 102.5),
  tx("2026-07-10", "Gasoline", "Transport", 60),
  tx("2026-07-14", "Pizza with Friends", "Restaurants", 42),
  tx("2026-07-19", "Concert", "Leisure", 65),
  tx("2026-07-21", "Weekly Groceries", "Groceries", 79.9),
  tx("2026-07-28", "Freelance Project", "Extra", 520),

  tx("2026-08-01", "August Salary", "Salary", 2450),
  tx("2026-08-01", "Rent", "Rent", 780),
  tx("2026-08-05", "Weekly Groceries", "Groceries", 96),
  tx("2026-08-09", "Electricity Bill", "Bills", 58),
  tx("2026-08-12", "Weekend Train", "Transport", 74),
  tx("2026-08-16", "Beach Restaurant", "Restaurants", 88),
  tx("2026-08-20", "Weekly Groceries", "Groceries", 83.4),
  tx("2026-08-24", "Museum", "Leisure", 18),
];