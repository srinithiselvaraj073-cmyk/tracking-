export type TransactionType = "income" | "expense";

export const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  expense: ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"],
} as const;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string
  createdAt: string;
}
