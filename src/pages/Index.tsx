import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { StatCards } from "@/components/StatCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { Charts } from "@/components/Charts";
import { Filters } from "@/components/Filters";
import { Transaction } from "@/types/transaction";

const Index = () => {
  const {
    transactions, allTransactions, totals,
    addTransaction, updateTransaction, deleteTransaction,
    filterCategory, setFilterCategory,
    filterType, setFilterType,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
  } = useTransactions();

  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const handleEdit = (tx: Transaction) => setEditingTx(tx);
  const handleUpdate = (data: Omit<Transaction, "id" | "createdAt">) => {
    if (editingTx) {
      updateTransaction(editingTx.id, data);
      setEditingTx(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2.5 rounded-xl bg-primary/15">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finance Tracker</h1>
            <p className="text-sm text-muted-foreground">Track your income & expenses</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Stats */}
          <StatCards {...totals} />

          {/* Charts */}
          <Charts transactions={allTransactions} />

          {/* Add/Edit Form */}
          {editingTx ? (
            <TransactionForm
              onSubmit={handleUpdate}
              editingTransaction={editingTx}
              onCancelEdit={() => setEditingTx(null)}
            />
          ) : (
            <TransactionForm onSubmit={addTransaction} />
          )}

          {/* Filters */}
          <Filters
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterType={filterType}
            setFilterType={setFilterType}
            filterDateFrom={filterDateFrom}
            setFilterDateFrom={setFilterDateFrom}
            filterDateTo={filterDateTo}
            setFilterDateTo={setFilterDateTo}
          />

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
