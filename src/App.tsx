import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
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

  const months = useMemo(() => availableMonths(items), [items]);
  const balance = useMemo(() => totalBalance(items), [items]);
  const timeline = useMemo(() => buildTimeline(items), [items]);
  const periodItems = useMemo(() => filterByPeriod(items, period), [items, period]);
  const stats = useMemo(() => computeStats(periodItems), [periodItems]);
  const breakdown = useMemo(() => buildBreakdown(periodItems), [periodItems]);

  return (
    <SettingsProvider>
      <Box sx={{ minHeight: "100vh" }}>
        <Topbar months={months} period={period} onPeriod={setPeriod}
          onAdd={() => setFormOpen(true)} onReset={reset} />

        <Container component="main" maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
          <Hero balance={balance} count={items.length} />
          <StatCards stats={stats} period={period} />

          <Box sx={{
            display: "grid", gap: 2.5, mb: 2.5,
            gridTemplateColumns: { xs: "1fr", md: "1.7fr 1fr" },
          }}>
            <BalanceChart data={timeline} />
            <CategoryDonut breakdown={breakdown} totalExpense={stats.expense} period={period} />
          </Box>

          <TransactionList items={periodItems} query={query} onQuery={setQuery}
            catFilter={catFilter} onCatFilter={setCatFilter} onRemove={remove} />
        </Container>

        <AddForm open={formOpen} onClose={() => setFormOpen(false)} onAdd={add} />
      </Box>
    </SettingsProvider>
  );
}