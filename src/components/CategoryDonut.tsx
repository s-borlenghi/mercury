import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { periodCaption } from "../lib/format";
import { useSettings } from "../context/Settings";
import type { BreakdownSlice, Period } from "../types";

interface TipProps {
  active?: boolean;
  payload?: Array<{ payload: BreakdownSlice }>;
}

function DonutTip({ active, payload }: TipProps) {
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
      <Typography sx={{ fontSize: 11.5, opacity: 0.7, mb: 0.25 }}>{p.cat}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
        {formatMoney(p.value)} · {Math.round(p.pct * 100)}%
      </Typography>
    </Box>
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
    <Paper sx={{ p: "20px 22px" }}>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1.5, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 15 }}>Expenses by Category</Typography>
        <Typography variant="caption" color="text.secondary">{periodCaption(period)}</Typography>
      </Box>

      {breakdown.length === 0 ? (
        <Box sx={{ py: 3.5, px: 1, color: "text.secondary", fontSize: 13.5, textAlign: "center" }}>
          No expenses in this period.
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ position: "relative", width: 172, height: 172, flex: "none" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="cat"
                  innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
                  {breakdown.map((d) => <Cell key={d.cat} fill={d.color} />)}
                </Pie>
                <Tooltip content={<DonutTip />} />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", pointerEvents: "none", textAlign: "center",
            }}>
              <Typography sx={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 17, fontWeight: 500 }}>
                {formatMoney(totalExpense)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3 }}>
                total expenses
              </Typography>
            </Box>
          </Box>
          <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
            {breakdown.map((d) => (
              <Box key={d.cat} sx={{ display: "flex", alignItems: "center", gap: 1.1, fontSize: 13 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: "2px", flex: "none", bgcolor: d.color }} />
                <Typography sx={{
                  color: "text.primary", flex: 1, whiteSpace: "nowrap", overflow: "hidden",
                  textOverflow: "ellipsis", fontSize: 13,
                }}>
                  {d.cat}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums", fontSize: 13 }}>
                  {Math.round(d.pct * 100)}%
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
}
