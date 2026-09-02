import { useState } from "react";
import { X } from "lucide-react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import ListSubheader from "@mui/material/ListSubheader";
import { CATEGORIES, CATEGORY_NAMES } from "../data/categories";
import type { CategoryName, NewTransaction } from "../types";

interface AddFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: (t: NewTransaction) => void;
}

const todayLocal = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function AddForm({ open, onClose, onAdd }: AddFormProps) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState<CategoryName>("Groceries");
  const [date, setDate] = useState(todayLocal);
  const [error, setError] = useState("");

  const submit = () => {
    const value = parseFloat(amount.replace(",", "."));
    if (!desc.trim()) return setError("Please enter a description.");
    if (!(value > 0)) return setError("Amount must be greater than zero.");
    onAdd({ desc: desc.trim(), amount: Math.round(value * 100) / 100, cat, date });
    onClose();
  };

  const byType = (type: "income" | "expense") =>
    CATEGORY_NAMES.filter((c) => CATEGORIES[c].type === type);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs"
      aria-label="New Transaction"
      keepMounted={false}
      slotProps={{ transition: { onExited: () => { setDesc(""); setAmount(""); setError(""); setDate(todayLocal()); } } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        New Transaction
        <IconButton onClick={onClose} aria-label="Close" size="small" sx={{ color: "text.secondary" }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
        <TextField
          label="Description" value={desc} onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Weekly groceries" autoFocus fullWidth size="small"
        />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          <TextField
            label="Amount (€)" value={amount} onChange={(e) => setAmount(e.target.value)}
            slotProps={{ htmlInput: { inputMode: "decimal" } }}
            placeholder="0.00" size="small"
          />
          <TextField
            label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
            size="small" slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <TextField
          select label="Category" value={cat}
          onChange={(e) => setCat(e.target.value as CategoryName)}
          size="small" fullWidth
        >
          <ListSubheader>Income</ListSubheader>
          {byType("income").map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          <ListSubheader>Expenses</ListSubheader>
          {byType("expense").map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>

        {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={submit} variant="contained" color="primary">Save Transaction</Button>
      </DialogActions>
    </Dialog>
  );
}
