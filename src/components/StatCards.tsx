import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardsProps {
  income: number;
  expense: number;
  balance: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function StatCards({ income, expense, balance }: StatCardsProps) {
  const cards = [
    {
      label: "Total Income",
      value: fmt(income),
      icon: TrendingUp,
      className: "stat-card-income",
    },
    {
      label: "Total Expenses",
      value: fmt(expense),
      icon: TrendingDown,
      className: "stat-card-expense",
    },
    {
      label: "Balance",
      value: fmt(balance),
      icon: DollarSign,
      className: "stat-card-balance",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className={`${card.className} p-5`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">{card.label}</span>
            <card.icon className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-2xl font-bold tracking-tight">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
