import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const dateFmt = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

const categoryIcons: Record<string, string> = {
  Salary: "💰", Freelance: "💻", Investment: "📈", Gift: "🎁",
  Food: "🍔", Travel: "✈️", Shopping: "🛍️", Bills: "📄",
  Entertainment: "🎮", Health: "💊", Education: "📚", Other: "📦",
};

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground">
        <p className="text-lg mb-1">No transactions yet</p>
        <p className="text-sm">Add your first income or expense above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            layout
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12, height: 0 }}
            transition={{ duration: 0.25 }}
            className="glass-card p-4 flex items-center gap-3 group"
          >
            <span className="text-xl">{categoryIcons[tx.category] ?? "📦"}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{tx.category}</span>
                <span className="text-xs text-muted-foreground">{dateFmt(tx.date)}</span>
              </div>
              {tx.description && (
                <p className="text-xs text-muted-foreground truncate">{tx.description}</p>
              )}
            </div>
            <span
              className={`font-semibold text-sm whitespace-nowrap ${
                tx.type === "income" ? "text-income" : "text-expense"
              }`}
            >
              {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(tx)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(tx.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
