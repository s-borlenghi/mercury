import { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { useExchangeRates } from "../hooks/useExchangeRates";
import { BASE_CURRENCY } from "../lib/rates";
import type { RatesStatus } from "../hooks/useExchangeRates";
import type { Currency } from "../types";

const LOCALES: Record<Currency, string> = { EUR: "it-IT", USD: "en-US", GBP: "en-GB" };
export const CURRENCIES = Object.keys(LOCALES) as Currency[];

interface SettingsValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatMoney: (n: number) => string;
  ratesStatus: RatesStatus;
  ratesAsOf: string | null;
  ratesNote: string | null;
}

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(BASE_CURRENCY);
  const { rates, status: ratesStatus, asOf: ratesAsOf } = useExchangeRates(CURRENCIES);

  // Transaction amounts are always entered and stored in BASE_CURRENCY
  // (EUR). Formatting converts through the live rate for the selected
  // currency, falling back to the raw amount if rates haven't loaded yet.
  const formatMoney = useCallback(
    (n: number) => {
      const rate = rates?.[currency] ?? 1;
      return new Intl.NumberFormat(LOCALES[currency], { style: "currency", currency }).format(n * rate);
    },
    [currency, rates]
  );

  // Only relevant once the user picks a non-base currency - converting EUR
  // to EUR needs no rate and is never stale.
  const ratesNote = useMemo(() => {
    if (currency === BASE_CURRENCY) return null;
    if (ratesStatus === "loading") return "Loading live exchange rates…";
    if (ratesStatus === "error") return "Live rates unavailable — amount shown unconverted";
    return ratesAsOf ? `Converted using ECB rates as of ${ratesAsOf}` : null;
  }, [currency, ratesStatus, ratesAsOf]);

  const value = useMemo<SettingsValue>(
    () => ({ currency, setCurrency, formatMoney, ratesStatus, ratesAsOf, ratesNote }),
    [currency, formatMoney, ratesStatus, ratesAsOf, ratesNote]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
