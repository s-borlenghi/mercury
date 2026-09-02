import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { periodCaption } from "../lib/format";
import { useSettings } from "../context/Settings";
import type { BreakdownSlice, Period } from "../types";

interface TipProps {
  active?: boolean;
  payload?: Array<{ payload: BreakdownSlice }>;
}

function DonutTip({ active, payload }: TipProps) {
  const { formatMoney } = useSettings();
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="mrc-tip">
      <div className="mrc-tip-k">{p.cat}</div>
      <div className="mrc-tip-v">{formatMoney(p.value)} · {Math.round(p.pct * 100)}%</div>
    </div>
  );
}

interface DonutProps {
  breakdown: BreakdownSlice[];
  totalExpense: number;
  period: Period;
}

export default function CategoryDonut({ breakdown, totalExpense, period }: DonutProps) {
  const { formatMoney } = useSettings();

  return (
    <div className="mrc-panel">
      <div className="mrc-panel-head">
        <h2>Uscite per categoria</h2>
        <span className="mrc-panel-sub">{periodCaption(period)}</span>
      </div>

      {breakdown.length === 0 ? (
        <div className="mrc-empty">Nessuna uscita nel periodo.</div>
      ) : (
        <div className="mrc-donut-wrap">
          <div className="mrc-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="cat"
                  innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
                  {breakdown.map((d) => <Cell key={d.cat} fill={d.color} />)}
                </Pie>
                <Tooltip content={<DonutTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mrc-donut-center">
              <span>{formatMoney(totalExpense)}</span>
              <small>totale uscite</small>
            </div>
          </div>
          <ul className="mrc-legend">
            {breakdown.map((d) => (
              <li key={d.cat}>
                <span className="mrc-dot" style={{ background: d.color }} />
                <span className="mrc-legend-name">{d.cat}</span>
                <span className="mrc-legend-pct">{Math.round(d.pct * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
