import { useMemo } from "react";
import { Search, Trash2 } from "lucide-react";
import { CATEGORIES, CATEGORY_NAMES } from "../data/categories.js";
import { dayLabel } from "../lib/format.js";
import { useSettings } from "../context/Settings.jsx";

export default function TransactionList({
  items, query, onQuery, catFilter, onCatFilter, onRemove,
}) {
  const { formatMoney } = useSettings();

  // One filtering pass, then sort newest-first. Recomputed only when the
  // inputs change, so typing in the search box stays cheap.
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
    <section className="sld-panel">
      <div className="sld-panel-head sld-tx-head">
        <h2>Movimenti</h2>
        <div className="sld-tx-tools">
          <div className="sld-search">
            <Search size={15} />
            <input value={query} onChange={(e) => onQuery(e.target.value)}
              placeholder="Cerca…" aria-label="Cerca movimenti" />
          </div>
          <select className="sld-select" value={catFilter}
            onChange={(e) => onCatFilter(e.target.value)} aria-label="Filtra per categoria">
            <option value="all">Tutte le categorie</option>
            {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="sld-empty">
          Nessun movimento trovato. Prova a cambiare filtri o periodo.
        </div>
      ) : (
        <ul className="sld-tx-list">
          {visible.map((t) => (
            <li key={t.id} className="sld-tx">
              <span className="sld-tx-dot" style={{ background: CATEGORIES[t.cat].color }} />
              <div className="sld-tx-main">
                <span className="sld-tx-desc">{t.desc}</span>
                <span className="sld-tx-meta">{t.cat} · {dayLabel(t.date)}</span>
              </div>
              <span className={"sld-tx-amt " + t.type}>
                {t.type === "income" ? "+" : "−"} {formatMoney(t.amount).replace("-", "")}
              </span>
              <button className="sld-tx-del" onClick={() => onRemove(t.id)}
                aria-label={`Elimina ${t.desc}`}>
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
