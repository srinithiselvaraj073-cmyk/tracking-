import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction, TransactionType, CATEGORIES } from "@/types/transaction";

interface TransactionFormProps {
  onSubmit: (data: Omit<Transaction, "id" | "createdAt">) => void;
  editingTransaction?: Transaction | null;
  onCancelEdit?: () => void;
}

export function TransactionForm({ onSubmit, editingTransaction, onCancelEdit }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!editingTransaction;

  const [type, setType] = useState<TransactionType>(editingTransaction?.type ?? "expense");
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() ?? "");
  const [category, setCategory] = useState(editingTransaction?.category ?? "");
  const [description, setDescription] = useState(editingTransaction?.description ?? "");
  const [date, setDate] = useState(editingTransaction?.date ?? new Date().toISOString().split("T")[0]);

  const resetForm = () => {
    setType("expense");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    onSubmit({ type, amount: parseFloat(amount), category, description, date });
    resetForm();
    if (!isEditing) setOpen(false);
    if (isEditing && onCancelEdit) onCancelEdit();
  };

  // When editing, always show form inline
  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Transaction</h3>
          <Button variant="ghost" size="icon" onClick={onCancelEdit}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <FormFields
          type={type} setType={setType}
          amount={amount} setAmount={setAmount}
          category={category} setCategory={setCategory}
          description={description} setDescription={setDescription}
          date={date} setDate={setDate}
          onSubmit={handleSubmit}
          submitLabel="Update"
        />
      </motion.div>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {!open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button
              onClick={() => setOpen(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Plus className="w-4 h-4" /> Add Transaction
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Transaction</h3>
              <Button variant="ghost" size="icon" onClick={() => { setOpen(false); resetForm(); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <FormFields
              type={type} setType={setType}
              amount={amount} setAmount={setAmount}
              category={category} setCategory={setCategory}
              description={description} setDescription={setDescription}
              date={date} setDate={setDate}
              onSubmit={handleSubmit}
              submitLabel="Add"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FormFieldsProps {
  type: TransactionType;
  setType: (t: TransactionType) => void;
  amount: string;
  setAmount: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

function FormFields({ type, setType, amount, setAmount, category, setCategory, description, setDescription, date, setDate, onSubmit, submitLabel }: FormFieldsProps) {
  const categories = CATEGORIES[type];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setType("income"); setCategory(""); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            type === "income"
              ? "bg-income/20 text-income border border-income/40"
              : "bg-secondary text-muted-foreground border border-transparent"
          }`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => { setType("expense"); setCategory(""); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            type === "expense"
              ? "bg-expense/20 text-expense border border-expense/40"
              : "bg-secondary text-muted-foreground border border-transparent"
          }`}
        >
          Expense
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">Amount</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-secondary border-border"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Description (optional)</Label>
        <Input
          placeholder="What was this for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-secondary border-border"
        />
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        {submitLabel}
      </Button>
    </form>
  );
}
