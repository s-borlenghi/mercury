import { Wallet, Plus } from "lucide-react";
import { monthLabel } from "../lib/format.js";
import { useSettings, CURRENCIES } from "../context/Settings.jsx";

function PeriodButton({ active, children, ...rest }) {
  return (
    <button className={"sld-period-btn" + (active ? " active" : "")}
      role="tab" aria-selected={active} {...rest}>
      {children}
    </button>
  );
}

export default function Topbar({ months, period, onPeriod, onAdd }) {
  const { currency, setCurrency } = useSettings();

  return (
    <header className="sld-topbar">
      <div className="sld-brand">
        <span className="sld-logo"><Wallet size={18} strokeWidth={2} /></span>
        <div>
          <div className="sld-brandname">Saldo</div>
          <div className="sld-brandsub">Finanze personali</div>
        </div>
      </div>

      <div className="sld-controls">
        <div className="sld-period" role="tablist" aria-label="Periodo">
          <PeriodButton active={period === "all"} onClick={() => onPeriod("all")}>
            Tutto
          </PeriodButton>
          {months.map((m) => (
            <PeriodButton key={m} active={period === m} onClick={() => onPeriod(m)}>
              {monthLabel(m)}
            </PeriodButton>
          ))}
        </div>

        <select className="sld-currency" value={currency} aria-label="Valuta"
          onChange={(e) => setCurrency(e.target.value)}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button className="sld-add" onClick={onAdd}>
          <Plus size={16} strokeWidth={2.4} /> Aggiungi
        </button>
      </div>
    </header>
  );
}
