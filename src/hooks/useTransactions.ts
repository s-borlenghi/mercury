import { useCallback } from "react";
import { SEED } from "../data/seed";
import { CATEGORIES } from "../data/categories";
import { usePersistentState } from "./usePersistentState";
import type { Transaction, NewTransaction } from "../types";

const STORAGE_KEY = "mercury.transactions";

export function useTransactions() {
  const [items, setItems] = usePersistentState<Transaction[]>(STORAGE_KEY, SEED);

  const add = useCallback(
    (payload: NewTransaction) => {
      setItems((prev) => {
        // Derive the next id from the current max, so it stays unique even
        // after transactions have been loaded from storage.
        const id = prev.reduce((max, t) => Math.max(max, t.id), 0) + 1;
        return [...prev, { id, ...payload, type: CATEGORIES[payload.cat].type }];
      });
    },
    [setItems]
  );

  const remove = useCallback(
    (id: number) => setItems((prev) => prev.filter((t) => t.id !== id)),
    [setItems]
  );

  const reset = useCallback(() => setItems(SEED), [setItems]);

  return { items, add, remove, reset };
}
