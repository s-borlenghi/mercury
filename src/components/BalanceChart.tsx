import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { dayLabel } from "../lib/format";
import { useSettings } from "../context/Settings";
import type { TimelinePoint } from "../types";

interface TipProps {
  active?: boolean;
  payload?: Array<{ payload: TimelinePoint }>;
}

function AreaTip({ active, payload }: TipProps) {
  const { formatMoney } = useSettings();
  const theme = useTheme();
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <Box sx={{
      bgcolor: theme.palette.mode === "dark" ? "#080b09" : theme.palette.text.primary,
      color: theme.palette.common.white, borderRadius: "8px", px: 1.4, py: 1,
      boxShadow: "0 8px 22px rgba(0,0,0,.3)",
    }}>
      <Typography sx={{ fontSize: 11.5, opacity: 0.7, mb: 0.25 }}>{dayLabel(p.date)}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
        {formatMoney(p.saldo)}
      </Typography>
    </Box>
  );
}

export default function BalanceChart({ data }: { data: TimelinePoint[] }) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const tickColor = theme.palette.text.secondary;

  return (
    <Paper sx={{ p: "20px 22px" }}>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1.5, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 15 }}>Balance Over Time</Typography>
        <Typography variant="caption" color="text.secondary">cumulative balance, all transactions</Typography>
      </Box>
      <Box sx={{ height: 232, ml: -0.75 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.28} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 11 }}
              axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false}
              tickLine={false} width={48}
              tickFormatter={(v: number) => (v >= 1000 ? v / 1000 + "k" : String(v))} />
            <Tooltip content={<AreaTip />} />
            <Area type="monotone" dataKey="saldo" stroke={accent}
              strokeWidth={2} fill="url(#gArea)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
