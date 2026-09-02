import { useState, useCallback } from "react";
import { SEED, nextId } from "../data/seed.js";
import { CATEGORIES } from "../data/categories.js";

/**
 * Holds the transactions state and the mutation operations.
 * Isolating state in a hook keeps the components focused on the UI.
 */
export function useTransactions() {
  const [items, setItems] = useState(SEED);

  const add = useCallback((payload) => {
    setItems((prev) => [
      ...prev,
      { id: nextId(), ...payload, type: CATEGORIES[payload.cat].type },
    ]);
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { items, add, remove };
}
