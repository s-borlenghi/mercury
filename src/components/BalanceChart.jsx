import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { dayLabel } from "../lib/format.js";
import { useSettings } from "../context/Settings.jsx";

const ACCENT = "#245c4d";

function AreaTip({ active, payload }) {
  const { formatMoney } = useSettings();
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="sld-tip">
      <div className="sld-tip-k">{dayLabel(p.date)}</div>
      <div className="sld-tip-v">{formatMoney(p.saldo)}</div>
    </div>
  );
}

export default function BalanceChart({ data }) {
  return (
    <div className="sld-panel sld-panel-wide">
      <div className="sld-panel-head">
        <h2>Andamento del saldo</h2>
        <span className="sld-panel-sub">saldo cumulato, tutti i movimenti</span>
      </div>
      <div className="sld-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.22} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fill: "#8a8f88", fontSize: 11 }}
              axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis tick={{ fill: "#8a8f88", fontSize: 11 }} axisLine={false}
              tickLine={false} width={48}
              tickFormatter={(v) => (v >= 1000 ? v / 1000 + "k" : v)} />
            <Tooltip content={<AreaTip />} />
            <Area type="monotone" dataKey="saldo" stroke={ACCENT}
              strokeWidth={2} fill="url(#gArea)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
