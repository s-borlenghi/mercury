import { Wallet, Plus, RotateCcw, Sun, Moon } from "lucide-react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { alpha } from "@mui/material/styles";
import { monthLabel } from "../lib/format";
import { useSettings, CURRENCIES } from "../context/Settings";
import { useColorMode } from "../theme";
import type { Currency, Period } from "../types";

interface TopbarProps {
  months: string[];
  period: Period;
  onPeriod: (p: Period) => void;
  onAdd: () => void;
  onReset: () => void;
}

export default function Topbar({ months, period, onPeriod, onAdd, onReset }: TopbarProps) {
  const { currency, setCurrency } = useSettings();
  const { mode, toggle } = useColorMode();

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2, py: 1.5, flexWrap: "wrap", minHeight: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: "auto" }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "9px", display: "grid", placeItems: "center",
            color: "background.default", bgcolor: "primary.main",
          }}>
            <Wallet size={18} strokeWidth={2} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Balance
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              Personal Finance
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_, next) => next && onPeriod(next)}
            aria-label="Period"
            size="small"
            sx={{
              bgcolor: "background.paper",
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: "9px",
              p: "3px",
              gap: "2px",
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            {months.map((m) => (
              <ToggleButton key={m} value={m}>{monthLabel(m)}</ToggleButton>
            ))}
          </ToggleButtonGroup>

          <IconButton onClick={onReset} aria-label="Reset to sample data" title="Reset to sample data"
            sx={{
              width: 34, height: 34, border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: "9px", color: "text.secondary",
            }}>
            <RotateCcw size={16} />
          </IconButton>

          <IconButton onClick={toggle} aria-label="Toggle color mode" title="Toggle color mode"
            sx={{
              width: 34, height: 34, border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: "9px", color: "text.secondary",
            }}>
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </IconButton>

          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            aria-label="Currency"
            size="small"
            sx={{
              bgcolor: "background.paper", fontSize: 13, fontWeight: 500,
              "& .MuiSelect-select": { py: "8px" },
            }}
          >
            {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>

          <Button
            onClick={onAdd}
            variant="contained"
            color="primary"
            startIcon={<Plus size={16} strokeWidth={2.4} />}
            sx={{
              px: 2, "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.88) },
            }}
          >
            Add
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
