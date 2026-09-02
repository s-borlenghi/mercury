import type { Currency } from "../types";

// Frankfurter is a free, keyless, CORS-enabled ECB-rate API - the only kind
// of API this app can call directly, since it has no backend and any API
// key shipped in client code would be public.
const ENDPOINT = "https://api.frankfurter.dev/v1/latest";

export const BASE_CURRENCY: Currency = "EUR";

export interface RateSnapshot {
  date: string;
  rates: Record<Currency, number>;
}

export async function fetchRates(targets: Currency[]): Promise<RateSnapshot> {
  const to = targets.filter((c) => c !== BASE_CURRENCY);
  const res = await fetch(`${ENDPOINT}?from=${BASE_CURRENCY}&to=${to.join(",")}`);
  if (!res.ok) throw new Error(`Exchange rate request failed: ${res.status}`);
  const data = (await res.json()) as { date: string; rates: Partial<Record<Currency, number>> };
  return { date: data.date, rates: { ...data.rates, [BASE_CURRENCY]: 1 } as Record<Currency, number> };
}
