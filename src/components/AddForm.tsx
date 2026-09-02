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
  const [cat, setCat] = useState<CategoryName>("Spesa");
  const [date, setDate] = useState("2026-09-02");
  const [error, setError] = useState("");

  const submit = () => {
    const value = parseFloat(amount.replace(",", "."));
    if (!desc.trim()) return setError("Inserisci una descrizione.");
    if (!(value > 0)) return setError("L'importo deve essere maggiore di zero.");
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
      <div className="mrc-modal" role="dialog" aria-label="Nuovo movimento"
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="mrc-modal-head">
          <h3>Nuovo movimento</h3>
          <button className="mrc-icon-btn" onClick={onClose} aria-label="Chiudi">
            <X size={18} />
          </button>
        </div>

        <label className="mrc-field">
          <span>Descrizione</span>
          <input value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="es. Spesa settimanale" autoFocus />
        </label>

        <div className="mrc-row">
          <label className="mrc-field">
            <span>Importo (€)</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal" placeholder="0,00" />
          </label>
          <label className="mrc-field">
            <span>Data</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <label className="mrc-field">
          <span>Categoria</span>
          <select value={cat} onChange={(e) => setCat(e.target.value as CategoryName)}>
            <optgroup label="Entrate">
              {byType("income").map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
            <optgroup label="Uscite">
              {byType("expense").map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
          </select>
        </label>

        {error && <div className="mrc-error">{error}</div>}

        <div className="mrc-modal-actions">
          <button className="mrc-btn ghost" onClick={onClose}>Annulla</button>
          <button className="mrc-btn primary" onClick={submit}>Salva movimento</button>
        </div>
      </div>
    </div>
  );
}
