export type TransactionType = "income" | "expense";

export type CategoryName =
  | "Stipendio" | "Extra" | "Affitto" | "Spesa"
  | "Trasporti" | "Ristoranti" | "Bollette" | "Svago";

export interface Category {
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: number;
  date: string;        // ISO "YYYY-MM-DD"
  desc: string;
  cat: CategoryName;
  amount: number;
  type: TransactionType;
}

// What the form provides; id and type are derived when the transaction is added.
export type NewTransaction = Omit<Transaction, "id" | "type">;

export interface Stats {
  income: number;
  expense: number;
  net: number;
}

export interface BreakdownSlice {
  cat: CategoryName;
  value: number;
  pct: number;
  color: string;
}

export interface TimelinePoint {
  date: string;
  label: string;
  saldo: number;
}

export type Period = "all" | string;   // "all" or a month key like "2026-08"
export type Currency = "EUR" | "USD" | "GBP";
