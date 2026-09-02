import type { Category, CategoryName } from "../types";

export const CATEGORIES: Record<CategoryName, Category> = {
  Salary: { type: "income", color: "#2f6e5b" },
  Extra: { type: "income", color: "#5a8f7f" },
  Rent: { type: "expense", color: "#a6432b" },
  Groceries: { type: "expense", color: "#c0842d" },
  Transport: { type: "expense", color: "#6b6597" },
  Restaurants: { type: "expense", color: "#b25e6b" },
  Bills: { type: "expense", color: "#4a6d8c" },
  Leisure: { type: "expense", color: "#7a8c4e" },
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES) as CategoryName[];