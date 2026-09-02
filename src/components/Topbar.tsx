import { Wallet, Plus, RotateCcw } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { monthLabel } from "../lib/format";
import { useSettings, CURRENCIES } from "../context/Settings";
import type { Currency, Period } from "../types";

interface TopbarProps {
  months: string[];
  period: Period;
  onPeriod: (p: Period) => void;
  onAdd: () => void;
  onReset: () => void;
}

function PeriodButton(
  { active, ...rest }: { active: boolean } & ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button className={"mrc-period-btn" + (active ? " active" : "")}
      role="tab" aria-selected={active} {...rest} />
  );
}

export default function Topbar({ months, period, onPeriod, onAdd, onReset }: TopbarProps) {
  const { currency, setCurrency } = useSettings();

  return (
    <header className="mrc-topbar">
      <div className="mrc-brand">
        <span className="mrc-logo"><Wallet size={18} strokeWidth={2} /></span>
        <div>
          <div className="mrc-brandname">Balance</div>
          <div className="mrc-brandsub">Personal Finance</div>
        </div>
      </div>

      <div className="mrc-controls">
        <div className="mrc-period" role="tablist" aria-label="Period">
          <PeriodButton active={period === "all"} onClick={() => onPeriod("all")}>
            All
          </PeriodButton>
          {months.map((m) => (
            <PeriodButton key={m} active={period === m} onClick={() => onPeriod(m)}>
              {monthLabel(m)}
            </PeriodButton>
          ))}
        </div>

        <button className="mrc-icon-btn ghost-line" onClick={onReset}
          aria-label="Reset to sample data" title="Reset to sample data">
          <RotateCcw size={16} />
        </button>

        <select className="mrc-currency" value={currency} aria-label="Currency"
          onChange={(e) => setCurrency(e.target.value as Currency)}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button className="mrc-add" onClick={onAdd}>
          <Plus size={16} strokeWidth={2.4} /> Add
        </button>
      </div>
    </header>
  );
}