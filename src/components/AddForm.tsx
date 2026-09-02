import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES, CATEGORY_NAMES } from "../data/categories";
import type { CategoryName, NewTransaction } from "../types";

interface AddFormProps {
  onClose: () => void;
  onAdd: (t: NewTransaction) => void;
}

export default function AddForm({ onClose, onAdd }: AddFormProps) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState<CategoryName>("Groceries");
  const [date, setDate] = useState("2026-09-02");
  const [error, setError] = useState("");

  const submit = () => {
    const value = parseFloat(amount.replace(",", "."));
    if (!desc.trim()) return setError("Please enter a description.");
    if (!(value > 0)) return setError("Amount must be greater than zero.");
    onAdd({ desc: desc.trim(), amount: Math.round(value * 100) / 100, cat, date });
    onClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const byType = (type: "income" | "expense") =>
    CATEGORY_NAMES.filter((c) => CATEGORIES[c].type === type);

  return (
    <div className="mrc-overlay" onMouseDown={onClose}>
      <div className="mrc-modal" role="dialog" aria-label="New Transaction"
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="mrc-modal-head">
          <h3>New Transaction</h3>
          <button className="mrc-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <label className="mrc-field">
          <span>Description</span>
          <input value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g. Weekly groceries" autoFocus />
        </label>

        <div className="mrc-row">
          <label className="mrc-field">
            <span>Amount (€)</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal" placeholder="0.00" />
          </label>
          <label className="mrc-field">
            <span>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <label className="mrc-field">
          <span>Category</span>
          <select value={cat} onChange={(e) => setCat(e.target.value as CategoryName)}>
            <optgroup label="Income">
              {byType("income").map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
            <optgroup label="Expenses">
              {byType("expense").map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
          </select>
        </label>

        {error && <div className="mrc-error">{error}</div>}

        <div className="mrc-modal-actions">
          <button className="mrc-btn ghost" onClick={onClose}>Cancel</button>
          <button className="mrc-btn primary" onClick={submit}>Save Transaction</button>
        </div>
      </div>
    </div>
  );
}