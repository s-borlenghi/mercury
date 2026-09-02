import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

// Like useState, but mirrored to localStorage so the value survives reloads.
// SSR/test-safe: with no window it simply behaves like useState(initial).
export function usePersistentState<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota or privacy-mode write failures.
    }
  }, [key, state]);

  return [state, setState];
}
