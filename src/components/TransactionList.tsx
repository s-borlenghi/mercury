import { useMemo } from "react";
import { Search, Trash2 } from "lucide-react";
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
    <section className="mrc-panel">
      <div className="mrc-panel-head mrc-tx-head">
        <h2>Movimenti</h2>
        <div className="mrc-tx-tools">
          <div className="mrc-search">
            <Search size={15} />
            <input value={query} onChange={(e) => onQuery(e.target.value)}
              placeholder="Cerca…" aria-label="Cerca movimenti" />
          </div>
          <select className="mrc-select" value={catFilter}
            onChange={(e) => onCatFilter(e.target.value as CatFilter)}
            aria-label="Filtra per categoria">
            <option value="all">Tutte le categorie</option>
            {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mrc-empty">
          Nessun movimento trovato. Prova a cambiare filtri o periodo.
        </div>
      ) : (
        <ul className="mrc-tx-list">
          {visible.map((t) => (
            <li key={t.id} className="mrc-tx">
              <span className="mrc-tx-dot" style={{ background: CATEGORIES[t.cat].color }} />
              <div className="mrc-tx-main">
                <span className="mrc-tx-desc">{t.desc}</span>
                <span className="mrc-tx-meta">{t.cat} · {dayLabel(t.date)}</span>
              </div>
              <span className={"mrc-tx-amt " + t.type}>
                {t.type === "income" ? "+" : "−"} {formatMoney(t.amount).replace("-", "")}
              </span>
              <button className="mrc-tx-del" onClick={() => onRemove(t.id)}
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
