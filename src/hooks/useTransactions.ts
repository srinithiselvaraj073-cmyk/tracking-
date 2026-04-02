import { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Transaction, TransactionType } from "@/types/transaction";

const STORAGE_KEY = "finance-tracker-transactions";

function loadTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const addTransaction = (data: Omit<Transaction, "id" | "createdAt">) => {
    const newTx: Transaction = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterCategory !== "all" && tx.category !== filterCategory) return false;
      if (filterType !== "all" && tx.type !== filterType) return false;
      if (filterDateFrom && tx.date < filterDateFrom) return false;
      if (filterDateTo && tx.date > filterDateTo) return false;
      return true;
    });
  }, [transactions, filterCategory, filterType, filterDateFrom, filterDateTo]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  return {
    transactions: filtered,
    allTransactions: transactions,
    totals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
  };
}
