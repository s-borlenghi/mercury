import { useEffect, useState } from "react";
import { fetchRates } from "../lib/rates";
import type { Currency } from "../types";

const STORAGE_KEY = "mercury.rates";
const MAX_AGE_MS = 6 * 60 * 60 * 1000; // ECB rates only change once a day; no need to refetch often.

interface CachedRates {
  date: string;
  rates: Record<Currency, number>;
  fetchedAt: number;
}

export type RatesStatus = "loading" | "ready" | "error";

interface ExchangeRatesValue {
  rates: Record<Currency, number> | null;
  status: RatesStatus;
  asOf: string | null;
}

const readCache = (): CachedRates | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CachedRates) : null;
  } catch {
    return null;
  }
};

// Fetches live exchange rates once per session (or once the cache goes
// stale), caching the result in localStorage. Falls back to "error" status
// on failure so callers can treat amounts as unconverted rather than crash.
export function useExchangeRates(targets: Currency[]): ExchangeRatesValue {
  const [cache, setCache] = useState<CachedRates | null>(readCache);
  const [status, setStatus] = useState<RatesStatus>(cache ? "ready" : "loading");

  useEffect(() => {
    if (cache && Date.now() - cache.fetchedAt < MAX_AGE_MS) return;

    let cancelled = false;
    fetchRates(targets)
      .then((result) => {
        if (cancelled) return;
        const next: CachedRates = { ...result, fetchedAt: Date.now() };
        setCache(next);
        setStatus("ready");
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore quota or privacy-mode write failures - the fetched rates still work for this session.
        }
      })
      .catch(() => {
        if (!cancelled) setStatus((s) => (s === "ready" ? s : "error"));
      });

    return () => {
      cancelled = true;
    };
    // Intentionally runs once per mount: rates are refreshed based on cache
    // age, not on `targets`, which never changes at runtime.
  }, []);

  return { rates: cache?.rates ?? null, status: cache ? "ready" : status, asOf: cache?.date ?? null };
}
