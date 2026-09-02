import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { periodCaption } from "../lib/format";
import { useSettings } from "../context/Settings";
import type { Stats, Period } from "../types";

interface CellProps {
  label: string;
  value: number;
  tone: "up" | "down";
  icon: ReactNode;
  caption: string;
  fmt: (n: number) => string;
  signed?: boolean;
}

function Cell({ label, value, tone, icon, caption, fmt, signed }: CellProps) {
  const shown = signed && value > 0 ? "+" + fmt(value) : fmt(value);
  return (
    <div className="mrc-stat">
      <div className={"mrc-stat-icon " + tone}>{icon}</div>
      <div className="mrc-stat-body">
        <span className="mrc-stat-label">{label}</span>
        <span className={"mrc-stat-value " + tone}>{shown}</span>
        <span className="mrc-stat-caption">{caption}</span>
      </div>
    </div>
  );
}

export default function StatCards({ stats, period }: { stats: Stats; period: Period }) {
  const { formatMoney } = useSettings();
  const caption = periodCaption(period);
  const netTone: "up" | "down" = stats.net >= 0 ? "up" : "down";

  return (
    <section className="mrc-stats">
      <Cell label="Income" value={stats.income} tone="up" caption={caption}
        fmt={formatMoney} icon={<ArrowDownLeft size={15} />} />
      <Cell label="Expenses" value={stats.expense} tone="down" caption={caption}
        fmt={formatMoney} icon={<ArrowUpRight size={15} />} />
      <Cell label="Net" value={stats.net} tone={netTone} caption={caption} signed
        fmt={formatMoney}
        icon={stats.net >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />} />
    </section>
  );
}