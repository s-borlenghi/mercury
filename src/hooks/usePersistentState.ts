import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

type StorageKind = "local" | "session";

const getStorage = (kind: StorageKind): Storage | null => {
  if (typeof window === "undefined") return null;
  return kind === "session" ? window.sessionStorage : window.localStorage;
};

// Like useState, but mirrored to Web Storage so the value survives reloads.
// "local" (the default) persists across tabs and browser restarts; "session"
// persists across reloads in the same tab only - a new tab always starts
// from `initial`, which keeps a shared demo link from leaking one guest's
// data into the next guest's tab.
// SSR/test-safe: with no window it simply behaves like useState(initial).
export function usePersistentState<T>(
  key: string,
  initial: T,
  kind: StorageKind = "local"
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const storage = getStorage(kind);
    if (!storage) return initial;
    try {
      const raw = storage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    const storage = getStorage(kind);
    if (!storage) return;
    try {
      storage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota or privacy-mode write failures.
    }
  }, [key, state, kind]);

  return [state, setState];
}
