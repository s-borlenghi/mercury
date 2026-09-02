import { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import type { Currency } from "../types";

const LOCALES: Record<Currency, string> = { EUR: "it-IT", USD: "en-US", GBP: "en-GB" };
export const CURRENCIES = Object.keys(LOCALES) as Currency[];

interface SettingsValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatMoney: (n: number) => string;
}

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("EUR");

  // Formatting only: switching currency reformats the same amounts,
  // it does not apply exchange rates.
  const formatMoney = useCallback(
    (n: number) =>
      new Intl.NumberFormat(LOCALES[currency], { style: "currency", currency }).format(n),
    [currency]
  );

  const value = useMemo<SettingsValue>(
    () => ({ currency, setCurrency, formatMoney }),
    [currency, formatMoney]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
