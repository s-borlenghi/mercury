import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { periodCaption } from "../lib/format.js";
import { useSettings } from "../context/Settings.jsx";

function Cell({ label, value, tone, icon, caption, signed, fmt }) {
  const shown = signed && value > 0 ? "+" + fmt(value) : fmt(value);
  return (
    <div className="sld-stat">
      <div className={"sld-stat-icon " + tone}>{icon}</div>
      <div className="sld-stat-body">
        <span className="sld-stat-label">{label}</span>
        <span className={"sld-stat-value " + tone}>{shown}</span>
        <span className="sld-stat-caption">{caption}</span>
      </div>
    </div>
  );
}

export default function StatCards({ stats, period }) {
  const { formatMoney } = useSettings();
  const caption = periodCaption(period);
  const netTone = stats.net >= 0 ? "up" : "down";

  return (
    <section className="sld-stats">
      <Cell label="Entrate" value={stats.income} tone="up" caption={caption}
        fmt={formatMoney} icon={<ArrowDownLeft size={15} />} />
      <Cell label="Uscite" value={stats.expense} tone="down" caption={caption}
        fmt={formatMoney} icon={<ArrowUpRight size={15} />} />
      <Cell label="Netto periodo" value={stats.net} tone={netTone} caption={caption} signed
        fmt={formatMoney}
        icon={stats.net >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />} />
    </section>
  );
}
