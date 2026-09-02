export type TransactionType = "income" | "expense";

export type CategoryName =
  | "Salary" | "Extra" | "Rent" | "Groceries"
  | "Transport" | "Restaurants" | "Bills" | "Leisure";

export interface Category {
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: number;
  date: string;
  desc: string;
  cat: CategoryName;
  amount: number;
  type: TransactionType;
}

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

export type Period = "all" | string;
export type Currency = "EUR" | "USD" | "GBP";