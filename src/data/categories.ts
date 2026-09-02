import type { Category, CategoryName } from "../types";

// Muted, editorial palette — deliberately not the bright neon set that reads
// as a generic dashboard.
export const CATEGORIES: Record<CategoryName, Category> = {
  Stipendio:  { type: "income",  color: "#2f6e5b" }, // pine
  Extra:      { type: "income",  color: "#5a8f7f" }, // sage
  Affitto:    { type: "expense", color: "#a6432b" }, // sienna
  Spesa:      { type: "expense", color: "#c0842d" }, // ochre
  Trasporti:  { type: "expense", color: "#6b6597" }, // muted violet
  Ristoranti: { type: "expense", color: "#b25e6b" }, // dusty rose
  Bollette:   { type: "expense", color: "#4a6d8c" }, // slate blue
  Svago:      { type: "expense", color: "#7a8c4e" }, // olive
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES) as CategoryName[];
