import { useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Transaction } from "@/types/transaction";

interface ChartsProps {
  transactions: Transaction[];
}

const INCOME_COLORS = ["#2dd4bf", "#34d399", "#22d3ee", "#60a5fa", "#a78bfa"];
const EXPENSE_COLORS = ["#f43f5e", "#fb923c", "#f59e0b", "#ef4444", "#e879f9", "#ec4899", "#f97316", "#a855f7"];

export function Charts({ transactions }: ChartsProps) {
  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7); // YYYY-MM
      const entry = map.get(month) ?? { income: 0, expense: 0 };
      entry[t.type] += t.amount;
      map.set(month, entry);
    });
    return Array.from(map, ([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      ...data,
    })).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground">
        <p>Add transactions to see charts</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pie Chart - Expense Breakdown */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
          Expense Breakdown
        </h3>
        {expenseByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {expenseByCategory.map((_, i) => (
                  <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(225 20% 14%)",
                  border: "1px solid hsl(225 15% 20%)",
                  borderRadius: "8px",
                  color: "hsl(210 40% 96%)",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-12">No expenses yet</p>
        )}
      </div>

      {/* Bar Chart - Monthly Overview */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
          Monthly Overview
        </h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(225 20% 14%)",
                  border: "1px solid hsl(225 15% 20%)",
                  borderRadius: "8px",
                  color: "hsl(210 40% 96%)",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
              />
              <Bar dataKey="income" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-12">No data yet</p>
        )}
      </div>
    </div>
  );
}
