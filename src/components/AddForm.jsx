import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES, CATEGORY_NAMES } from "../data/categories.js";

export default function AddForm({ onClose, onAdd }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("Spesa");
  const [date, setDate] = useState("2026-09-02");
  const [error, setError] = useState("");

  const submit = () => {
    const value = parseFloat(String(amount).replace(",", "."));
    if (!desc.trim()) return setError("Inserisci una descrizione.");
    if (!(value > 0)) return setError("L'importo deve essere maggiore di zero.");
    onAdd({ desc: desc.trim(), amount: Math.round(value * 100) / 100, cat, date });
    onClose();
  };

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const byType = (type) => CATEGORY_NAMES.filter((c) => CATEGORIES[c].type === type);

  return (
    <div className="sld-overlay" onMouseDown={onClose}>
      <div
        className="sld-modal" role="dialog" aria-label="Nuovo movimento"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sld-modal-head">
          <h3>Nuovo movimento</h3>
          <button className="sld-icon-btn" onClick={onClose} aria-label="Chiudi">
            <X size={18} />
          </button>
        </div>

        <label className="sld-field">
          <span>Descrizione</span>
          <input
            value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="es. Spesa settimanale" autoFocus
          />
        </label>

        <div className="sld-row">
          <label className="sld-field">
            <span>Importo (€)</span>
            <input
              value={amount} onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal" placeholder="0,00"
            />
          </label>
          <label className="sld-field">
            <span>Data</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <label className="sld-field">
          <span>Categoria</span>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <optgroup label="Entrate">
              {byType("income").map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
            <optgroup label="Uscite">
              {byType("expense").map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
          </select>
        </label>

        {error && <div className="sld-error">{error}</div>}

        <div className="sld-modal-actions">
          <button className="sld-btn ghost" onClick={onClose}>Annulla</button>
          <button className="sld-btn primary" onClick={submit}>Salva movimento</button>
        </div>
      </div>
    </div>
  );
}
