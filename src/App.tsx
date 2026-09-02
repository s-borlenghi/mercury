import { useState, useMemo } from "react";
import Topbar from "./components/Topbar";
import Hero from "./components/Hero";
import StatCards from "./components/StatCards";
import BalanceChart from "./components/BalanceChart";
import CategoryDonut from "./components/CategoryDonut";
import TransactionList from "./components/TransactionList";
import AddForm from "./components/AddForm";
import { SettingsProvider } from "./context/Settings";
import { useTransactions } from "./hooks/useTransactions";
import {
  totalBalance, buildTimeline, filterByPeriod, computeStats,
  buildBreakdown, availableMonths,
} from "./lib/selectors";
import type { Period, CategoryName } from "./types";

export default function App() {
  const { items, add, remove, reset } = useTransactions();

  const [period, setPeriod] = useState<Period>("all");
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | CategoryName>("all");
  const [formOpen, setFormOpen] = useState(false);

  // Read models derived from the transactions. periodItems feeds both the
  // stats and the breakdown, so the period is filtered once, not twice.
  const months = useMemo(() => availableMonths(items), [items]);
  const balance = useMemo(() => totalBalance(items), [items]);
  const timeline = useMemo(() => buildTimeline(items), [items]);
  const periodItems = useMemo(() => filterByPeriod(items, period), [items, period]);
  const stats = useMemo(() => computeStats(periodItems), [periodItems]);
  const breakdown = useMemo(() => buildBreakdown(periodItems), [periodItems]);

  return (
    <SettingsProvider>
      <div className="mrc-root">
        <Topbar months={months} period={period} onPeriod={setPeriod}
          onAdd={() => setFormOpen(true)} onReset={reset} />

        <main className="mrc-main">
          <Hero balance={balance} count={items.length} />
          <StatCards stats={stats} period={period} />

          <section className="mrc-charts">
            <BalanceChart data={timeline} />
            <CategoryDonut breakdown={breakdown} totalExpense={stats.expense} period={period} />
          </section>

          <TransactionList items={periodItems} query={query} onQuery={setQuery}
            catFilter={catFilter} onCatFilter={setCatFilter} onRemove={remove} />
        </main>

        {formOpen && <AddForm onClose={() => setFormOpen(false)} onAdd={add} />}
      </div>
    </SettingsProvider>
  );
}
