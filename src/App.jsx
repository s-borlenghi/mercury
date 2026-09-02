import { useState, useMemo } from "react";
import Topbar from "./components/Topbar.jsx";
import Hero from "./components/Hero.jsx";
import StatCards from "./components/StatCards.jsx";
import BalanceChart from "./components/BalanceChart.jsx";
import CategoryDonut from "./components/CategoryDonut.jsx";
import TransactionList from "./components/TransactionList.jsx";
import AddForm from "./components/AddForm.jsx";
import { SettingsProvider } from "./context/Settings.jsx";
import { useTransactions } from "./hooks/useTransactions.js";
import {
  totalBalance, buildTimeline, filterByPeriod, computeStats,
  buildBreakdown, availableMonths,
} from "./lib/selectors.js";

export default function App() {
  const { items, add, remove } = useTransactions();

  const [period, setPeriod] = useState("all");
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
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
      <div className="sld-root">
        <Topbar months={months} period={period}
          onPeriod={setPeriod} onAdd={() => setFormOpen(true)} />

        <main className="sld-main">
          <Hero balance={balance} count={items.length} />
          <StatCards stats={stats} period={period} />

          <section className="sld-charts">
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
