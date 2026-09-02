import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { periodCaption } from "../lib/format.js";
import { useSettings } from "../context/Settings.jsx";

function DonutTip({ active, payload }) {
  const { formatMoney } = useSettings();
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="sld-tip">
      <div className="sld-tip-k">{p.cat}</div>
      <div className="sld-tip-v">{formatMoney(p.value)} · {Math.round(p.pct * 100)}%</div>
    </div>
  );
}

export default function CategoryDonut({ breakdown, totalExpense, period }) {
  const { formatMoney } = useSettings();

  return (
    <div className="sld-panel">
      <div className="sld-panel-head">
        <h2>Uscite per categoria</h2>
        <span className="sld-panel-sub">{periodCaption(period)}</span>
      </div>

      {breakdown.length === 0 ? (
        <div className="sld-empty">Nessuna uscita nel periodo.</div>
      ) : (
        <div className="sld-donut-wrap">
          <div className="sld-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="cat"
                  innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
                  {breakdown.map((d) => <Cell key={d.cat} fill={d.color} />)}
                </Pie>
                <Tooltip content={<DonutTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="sld-donut-center">
              <span>{formatMoney(totalExpense)}</span>
              <small>totale uscite</small>
            </div>
          </div>
          <ul className="sld-legend">
            {breakdown.map((d) => (
              <li key={d.cat}>
                <span className="sld-dot" style={{ background: d.color }} />
                <span className="sld-legend-name">{d.cat}</span>
                <span className="sld-legend-pct">{Math.round(d.pct * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
