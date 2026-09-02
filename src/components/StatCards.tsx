import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
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
  const toneColor = tone === "up" ? "primary.main" : "secondary.main";

  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", p: "18px 20px", flex: 1, minWidth: 0 }}>
      <Box sx={{
        width: 32, height: 32, borderRadius: "8px", display: "grid", placeItems: "center", flex: "none",
        bgcolor: (t) => alpha(t.palette[tone === "up" ? "primary" : "secondary"].main, t.palette.mode === "dark" ? 0.18 : 0.12),
        color: toneColor,
      }}>
        {icon}
      </Box>
      <Stack spacing={0.3} sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography sx={{
          fontFamily: 'Fraunces, Georgia, serif', fontVariantNumeric: "tabular-nums",
          fontSize: 23, fontWeight: 500, color: toneColor,
        }}>
          {shown}
        </Typography>
        <Typography variant="caption" color="text.secondary">{caption}</Typography>
      </Stack>
    </Box>
  );
}

export default function StatCards({ stats, period }: { stats: Stats; period: Period }) {
  const { formatMoney } = useSettings();
  const caption = periodCaption(period);
  const netTone: "up" | "down" = stats.net >= 0 ? "up" : "down";

  return (
    <Paper sx={{
      display: "flex", flexDirection: { xs: "column", sm: "row" }, mb: 2.5, overflow: "hidden",
      "& > *:not(:first-of-type)": {
        borderTop: { xs: (t) => `1px solid ${t.palette.divider}`, sm: 0 },
        borderLeft: { xs: 0, sm: (t) => `1px solid ${t.palette.divider}` },
      },
    }}>
      <Cell label="Income" value={stats.income} tone="up" caption={caption}
        fmt={formatMoney} icon={<ArrowDownLeft size={15} />} />
      <Cell label="Expenses" value={stats.expense} tone="down" caption={caption}
        fmt={formatMoney} icon={<ArrowUpRight size={15} />} />
      <Cell label="Net" value={stats.net} tone={netTone} caption={caption} signed
        fmt={formatMoney}
        icon={stats.net >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />} />
    </Paper>
  );
}
