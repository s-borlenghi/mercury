import { useMemo } from "react";
import { Search, Trash2 } from "lucide-react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import { CATEGORIES, CATEGORY_NAMES } from "../data/categories";
import { dayLabel } from "../lib/format";
import { useSettings } from "../context/Settings";
import type { Transaction, CategoryName } from "../types";

type CatFilter = "all" | CategoryName;

interface TransactionListProps {
  items: Transaction[];
  query: string;
  onQuery: (q: string) => void;
  catFilter: CatFilter;
  onCatFilter: (c: CatFilter) => void;
  onRemove: (id: number) => void;
}

export default function TransactionList({
  items, query, onQuery, catFilter, onCatFilter, onRemove,
}: TransactionListProps) {
  const { formatMoney } = useSettings();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((t) => {
        if (catFilter !== "all" && t.cat !== catFilter) return false;
        return q ? t.desc.toLowerCase().includes(q) : true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }, [items, query, catFilter]);

  return (
    <Paper sx={{ p: "20px 22px" }}>
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 1.5, flexWrap: "wrap", mb: 2,
      }}>
        <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }}>Transactions</Typography>
        <Box sx={{ display: "flex", gap: 1.1, flexWrap: "wrap" }}>
          <TextField
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Search transactions"
            size="small"
            sx={{ width: 190, bgcolor: "background.default" }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={15} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Select
            value={catFilter}
            onChange={(e) => onCatFilter(e.target.value as CatFilter)}
            aria-label="Filter by category"
            size="small"
            sx={{ bgcolor: "background.default", fontSize: 13.5 }}
          >
            <MenuItem value="all">All categories</MenuItem>
            {CATEGORY_NAMES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </Box>
      </Box>

      {visible.length === 0 ? (
        <Box sx={{ py: 3.5, px: 1, color: "text.secondary", fontSize: 13.5, textAlign: "center" }}>
          No transactions found. Try changing filters or period.
        </Box>
      ) : (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {visible.map((t) => (
            <Box
              component="li"
              key={t.id}
              sx={{
                display: "flex", alignItems: "center", gap: 1.6, py: 1.6, px: 0.5,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                "&:last-of-type": { borderBottom: 0 },
                "&:hover .mrc-tx-del": { opacity: 1 },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", flex: "none", bgcolor: CATEGORIES[t.cat].color }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, flex: 1, minWidth: 0 }}>
                <Typography sx={{
                  fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {t.desc}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.cat} · {dayLabel(t.date)}
                </Typography>
              </Box>
              <Typography sx={{
                fontSize: 14, fontWeight: 500, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
                color: t.type === "income" ? "primary.main" : "text.primary",
              }}>
                {t.type === "income" ? "+" : "−"} {formatMoney(t.amount).replace("-", "")}
              </Typography>
              <IconButton
                className="mrc-tx-del"
                onClick={() => onRemove(t.id)}
                aria-label={`Delete ${t.desc}`}
                size="small"
                sx={{
                  color: "text.secondary", opacity: 0, transition: "opacity .15s, color .15s, background .15s",
                  "&:hover": { color: "secondary.main", bgcolor: (t2) => alpha(t2.palette.secondary.main, 0.12) },
                }}
              >
                <Trash2 size={15} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
