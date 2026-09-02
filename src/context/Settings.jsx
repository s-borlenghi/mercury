import { createContext, useContext, useState, useMemo, useCallback } from "react";

// Locale paired with each currency so grouping and symbols look native.
const LOCALES = { EUR: "it-IT", USD: "en-US", GBP: "en-GB" };
export const CURRENCIES = Object.keys(LOCALES);

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [currency, setCurrency] = useState("EUR");

  // Formatting only: switching currency reformats the same amounts,
  // it does not apply exchange rates.
  const formatMoney = useCallback(
    (n) =>
      new Intl.NumberFormat(LOCALES[currency], { style: "currency", currency }).format(n),
    [currency]
  );

  const value = useMemo(
    () => ({ currency, setCurrency, formatMoney }),
    [currency, formatMoney]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
